export interface LegalPage {
  slug: string;
  title: string;
  lastUpdated: string;
  content: string;
}

export const legalPages: LegalPage[] = [
  {
    slug: 'license',
    title: 'MIT License',
    lastUpdated: '2026-01-01',
    content: `
<p>MIT License</p>
<p>Copyright (c) 2026 SquaredR</p>
<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
    `.trim(),
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    lastUpdated: '2026-08-07',
    content: `
<h2>1. What This Covers</h2>
<p>These Terms of Service ("Terms") govern your use of the FieldCraft npm packages, documentation, and the FieldCraft website (collectively, "the Service"). By using any part of the Service, you agree to these Terms.</p>
<p>"SquaredR", "we", "us", and "our" refer to the maintainers of FieldCraft. "You" and "your" refer to anyone using the Service.</p>

<h2>2. The Software</h2>
<p>FieldCraft is a JSON-driven form engine distributed as npm packages. It includes:</p>
<ul>
<li><strong>Open-source packages</strong> (<code>@squaredr/fieldcraft-core</code>, <code>@squaredr/fieldcraft-react</code>, <code>@squaredr/fieldcraft-adapters</code>, <code>@squaredr/fieldcraft-templates-free</code>) released under the <a href="/legal/license">MIT License</a></li>
<li><strong>Commercial packages</strong> (<code>@squaredr/fieldcraft-pro</code> and related add-ons) that require a paid license for production use</li>
</ul>

<h2>3. Open-Source Packages</h2>
<p>The open-source packages are governed by the MIT License. Your rights and obligations for those packages are defined entirely by the MIT License — these Terms do not restrict or expand those rights.</p>

<h2>4. Commercial Packages</h2>
<p>Commercial packages require a valid license key for production use. The license terms for commercial packages are provided at the time of purchase. Using commercial packages in production without a valid license is not permitted.</p>
<p>Evaluation and non-production use of commercial packages may be permitted without a license key, as specified in the package documentation.</p>

<h2>5. You Are Responsible for What You Build</h2>
<p>FieldCraft is a tool. What you build with it is entirely your responsibility. You are solely responsible for:</p>
<ul>
<li>The forms you create, the data you collect through them, and how you handle that data</li>
<li>Complying with all laws and regulations that apply to your use case, including data protection and privacy laws</li>
<li>Ensuring your applications are lawful and do not infringe the rights of others</li>
</ul>
<p>SquaredR is not a party to the relationship between you and your users. We have no access to, control over, or responsibility for data collected through forms you build with FieldCraft.</p>

<h2>6. Intellectual Property</h2>
<p>The FieldCraft name, logo, and brand assets are the property of SquaredR. The MIT License grants rights to the software source code but does not grant rights to use SquaredR trademarks, except as needed to accurately describe the origin of the software (e.g., "built with FieldCraft").</p>
<p>Content you create using FieldCraft (form schemas, templates, applications) is yours. We claim no ownership over it.</p>
<p>Website content (documentation, blog posts, tutorials) is copyrighted by SquaredR. Code examples in the documentation are MIT-licensed and can be freely used.</p>

<h2>7. No Warranty</h2>
<p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. SQUAREDR DOES NOT WARRANT THAT THE SOFTWARE WILL BE ERROR-FREE, SECURE, OR UNINTERRUPTED. YOU USE IT AT YOUR OWN RISK.</p>

<h2>8. Limitation of Liability</h2>
<p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, SQUAREDR SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL.</p>
<p>SquaredR's total liability for any claim arising from the Service shall not exceed the amount you have paid SquaredR in the twelve (12) months preceding the claim, or fifty US dollars (US$50), whichever is greater.</p>

<h2>9. Indemnification</h2>
<p>You agree to indemnify and hold harmless SquaredR from any claims, damages, or expenses (including legal fees) arising from:</p>
<ul>
<li>Your use of the Service or anything you build with it</li>
<li>Your violation of these Terms</li>
<li>Your violation of any law or third-party rights</li>
<li>Any data you collect, process, or store using applications built with FieldCraft</li>
</ul>

<h2>10. Termination</h2>
<p>We may terminate access to commercial packages at any time if you violate their license terms. Your rights under the MIT License for open-source packages are irrevocable and survive any termination of these Terms.</p>
<p>Sections 5 through 9 survive termination.</p>

<h2>11. Changes to These Terms</h2>
<p>We may update these Terms. Changes will be posted on this page with an updated date. Continued use of the Service after changes constitutes acceptance.</p>

<h2>12. Severability</h2>
<p>If any provision of these Terms is found unenforceable, the remaining provisions continue in full force.</p>

<h2>13. Governing Law</h2>
<p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.</p>

<h2>14. Contact</h2>
<p>Questions about these Terms: <a href="mailto:hello@squaredr.tech">hello@squaredr.tech</a></p>
    `.trim(),
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    lastUpdated: '2026-08-07',
    content: `
<h2>1. What FieldCraft Is</h2>
<p>FieldCraft is a self-hosted, open-source form engine distributed as npm packages. It runs entirely on your infrastructure. SquaredR does not operate any backend service, database, or API that processes your data or your users' data.</p>
<p>This Privacy Policy covers only the FieldCraft website (fieldcraft.squaredr.tech) and npm package distribution. It does not cover what you do with FieldCraft after you install it — that is entirely your responsibility.</p>

<h2>2. The Website Does Not Collect Personal Data</h2>
<p>The FieldCraft website is a static site. It does not:</p>
<ul>
<li>Use cookies (tracking, analytics, or otherwise)</li>
<li>Run third-party tracking scripts (no Google Analytics, no Facebook Pixel, no ad networks)</li>
<li>Collect or store IP addresses</li>
<li>Require user accounts or logins</li>
<li>Process payments directly (commercial licenses are handled through separate channels)</li>
</ul>
<p>If we add analytics in the future, we will update this policy before doing so.</p>

<h2>3. npm Package Telemetry</h2>
<p>The FieldCraft npm packages display a console banner showing the version number on first load. This is a local <code>console.log</code> statement only — no network request is made and no data is sent to SquaredR or any third party.</p>
<p>The website hosts an optional, anonymous telemetry endpoint that counts aggregate installs. It receives no personally identifiable information — only a package name and version string. This endpoint can be fully disabled by setting the <code>FIELDCRAFT_TELEMETRY_DISABLED</code> environment variable before importing the package.</p>

<h2>4. Information You May Voluntarily Provide</h2>
<p>If you contact us by email (e.g., for support, license enquiries, or bug reports), we will have the information you choose to include in that communication. We use it only to respond to you and do not add it to any marketing list or database unless you explicitly ask to be added.</p>

<h2>5. Third-Party Services</h2>
<p>The website is hosted on Vercel. Vercel may collect standard server logs (IP addresses, request timestamps) as part of their infrastructure. This is governed by <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel's Privacy Policy</a>, not ours. We do not have access to Vercel's server logs.</p>
<p>npm packages are distributed through the npm registry, which is operated by GitHub/Microsoft. Their data practices are governed by their own privacy policies.</p>

<h2>6. Your Data in FieldCraft Deployments</h2>
<p>When you use FieldCraft to build forms, all form submission data stays on your infrastructure. SquaredR has zero access to it. You are solely responsible for:</p>
<ul>
<li>How you collect, store, and process data submitted through forms you build with FieldCraft</li>
<li>Complying with any privacy laws that apply to your use case (GDPR, CCPA, or any other regulation)</li>
<li>Providing your own privacy policy to your end users</li>
</ul>
<p>SquaredR provides a form rendering tool. We are not a party to the relationship between you and your users, and we bear no responsibility for how you handle their data.</p>

<h2>7. Children</h2>
<p>The FieldCraft website and npm packages are developer tools, not directed at children. We do not knowingly collect any information from anyone, let alone children.</p>

<h2>8. Changes</h2>
<p>We may update this Privacy Policy if our practices change (e.g., if we add analytics or a newsletter). Changes will be posted on this page with an updated date. Since we don't collect email addresses, we can't notify you directly — check this page if you're concerned.</p>

<h2>9. Contact</h2>
<p>If you have questions about this policy, email <a href="mailto:hello@squaredr.tech">hello@squaredr.tech</a>.</p>
    `.trim(),
  },
];

export function getLegalPageBySlug(slug: string): LegalPage | undefined {
  return legalPages.find((p) => p.slug === slug);
}

export function getAllLegalSlugs(): string[] {
  return legalPages.map((p) => p.slug);
}
