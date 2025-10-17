# Code Signing for Windows Installers

This guide explains how to sign your Windows installers in GitHub Actions without requiring administrator privileges.

## Problem

By default, `electron-builder` tries to download code signing tools that contain symbolic links, which requires admin privileges on Windows. This causes builds to fail with:

```
ERROR: Cannot create symbolic link : A required privilege is not held by the client.
```

## Solution

We've configured the project to skip code signing during local builds. For production releases via GitHub Actions, you should use proper code signing.

## Code Signing Options

### Option 1: Self-Signed Certificate (Free, Not Recommended for Production)

**Pros:**

- Free
- Works immediately
- Good for testing

**Cons:**

- Shows "Unknown Publisher" warning to users
- Not trusted by Windows SmartScreen
- Users must click through security warnings

**Setup:**

```bash
# Create self-signed certificate (PowerShell as Admin - ONE TIME ONLY)
$cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=Your Name" `
  -KeyAlgorithm RSA -KeyLength 2048 -Provider "Microsoft Enhanced RSA and AES Cryptographic Provider" `
  -CertStoreLocation "Cert:\CurrentUser\My" -NotAfter (Get-Date).AddYears(2)

# Export as PFX
$pwd = ConvertTo-SecureString -String "your-password" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath "certificate.pfx" -Password $pwd
```

### Option 2: DigiCert/Sectigo EV Code Signing (Recommended for Production)

**Pros:**

- Trusted by Windows immediately
- No security warnings for users
- Builds reputation with SmartScreen
- Professional appearance

**Cons:**

- Costs $200-400/year
- Requires business verification
- Takes 1-3 days for approval

**Providers:**

- [DigiCert](https://www.digicert.com/signing/code-signing-certificates) - $469/year
- [Sectigo](https://sectigo.com/ssl-certificates-tls/code-signing) - $299/year
- [SSL.com](https://www.ssl.com/certificates/ev-code-signing/) - $249/year

### Option 3: SignPath.io (Free for Open Source)

**Pros:**

- FREE for open source projects
- Proper EV code signing
- Trusted by Windows
- Managed signing (no certificate handling)

**Cons:**

- Only for open source (public repos)
- Must apply and be approved
- Some configuration required

**Setup:**

1. Apply at https://signpath.io/ (select "Open Source")
2. Once approved, add to GitHub Actions (see below)

## GitHub Actions Configuration

### Using SignPath.io (Recommended for Open Source)

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build-installers:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build application
        run: pnpm run electron:build
        env:
          # Disable code signing for initial build
          WIN_CSC_LINK: ''

      - name: Sign with SignPath
        uses: signpath/github-action-submit-signing-request@v1
        with:
          api-token: ${{ secrets.SIGNPATH_API_TOKEN }}
          organization-id: ${{ secrets.SIGNPATH_ORG_ID }}
          project-slug: 'zenoter'
          signing-policy-slug: 'release-signing'
          artifact-configuration-slug: 'windows-installer'
          input-artifact-path: 'dist/Zenoter-Setup-*.exe'
          output-artifact-path: 'dist/Zenoter-Setup-*-signed.exe'
          wait-for-completion: true

      - name: Upload Release Assets
        uses: softprops/action-gh-release@v1
        with:
          files: |
            dist/Zenoter-Setup-*-signed.exe
            dist/Zenoter-Setup-*.zip
```

### Using Your Own Certificate

```yaml
jobs:
  build-installers:
    runs-on: windows-latest
    steps:
      # ... (setup steps same as above)

      - name: Decode certificate
        run: |
          echo "${{ secrets.WINDOWS_CERTIFICATE }}" | base64 --decode > certificate.pfx

      - name: Build and sign
        run: pnpm run electron:build
        env:
          WIN_CSC_LINK: ./certificate.pfx
          WIN_CSC_KEY_PASSWORD: ${{ secrets.WINDOWS_CERTIFICATE_PASSWORD }}

      - name: Remove certificate
        if: always()
        run: rm -f certificate.pfx
```

### Secrets Setup

For your own certificate:

1. Convert PFX to Base64:

   ```bash
   base64 -i certificate.pfx -o certificate.txt
   ```

2. Add to GitHub Secrets:
   - `WINDOWS_CERTIFICATE` - Contents of certificate.txt
   - `WINDOWS_CERTIFICATE_PASSWORD` - Certificate password

For SignPath:

- `SIGNPATH_API_TOKEN` - From SignPath dashboard
- `SIGNPATH_ORG_ID` - Your organization ID

## Package.json Configuration

Update your `package.json` build config to enable signing when certificate is present:

```json
{
  "build": {
    "win": {
      "target": ["nsis", "zip"],
      "signAndEditExecutable": false, // Disable for local builds
      "signingHashAlgorithms": ["sha256"],
      "sign": "./scripts/sign.js" // Custom signing script (optional)
    }
  }
}
```

## Current Project Configuration

We have `signAndEditExecutable: false` to allow local builds without admin privileges. This means:

✅ **Local Development:** Builds work normally without certificates  
✅ **GitHub Actions:** Can add code signing in CI/CD pipeline  
⚠️ **Unsigned Builds:** Users will see "Unknown Publisher" warning

## Testing Unsigned vs Signed

**Unsigned installer:**

- Shows "Unknown Publisher"
- Windows Defender SmartScreen may block
- Requires user to click "More info" → "Run anyway"

**Signed installer:**

- Shows your company/name
- No SmartScreen warnings (after building reputation)
- Users can install directly

## Recommendations

1. **For MVP/Alpha:** Ship unsigned builds (current setup is fine)
2. **For Beta:** Get a code signing certificate or use SignPath
3. **For Production:** Must have proper EV code signing

## Cost-Benefit Analysis

| Stage             | Users                 | Recommendation          | Cost          |
| ----------------- | --------------------- | ----------------------- | ------------- |
| Alpha (0-50)      | Tech-savvy developers | Unsigned                | $0            |
| Beta (50-500)     | Early adopters        | Self-signed or SignPath | $0            |
| Production (500+) | General users         | EV Certificate          | $250-400/year |

## Next Steps

1. **Now:** Continue with unsigned builds for local testing
2. **Before public beta:** Apply to SignPath.io (if open source) or purchase certificate
3. **Update GitHub Actions:** Add signing step to release workflow
4. **Test:** Verify signed installer shows your name and no warnings

## Resources

- [electron-builder Code Signing Docs](https://www.electron.build/code-signing)
- [SignPath.io Documentation](https://signpath.io/documentation)
- [Windows Code Signing Best Practices](https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools)
- [SmartScreen Reputation Building](https://docs.microsoft.com/en-us/windows/security/threat-protection/windows-defender-smartscreen/windows-defender-smartscreen-overview)

---

**Status:** Currently using unsigned builds for development. Code signing will be added before public release.
