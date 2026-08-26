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
    lastUpdated: '2026-08-21',
    content: `
<h2>1. What This Covers</h2>
<p>These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the FieldCraft npm packages, documentation, and the FieldCraft website at fieldcraft.squaredr.tech (collectively, &ldquo;the Service&rdquo;). By installing any FieldCraft package, visiting the website, or purchasing a licence, you agree to these Terms in full. If you do not agree, do not use the Service.</p>
<p>&ldquo;SquaredR&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, and &ldquo;our&rdquo; refer to the maintainers of FieldCraft, operating from India. &ldquo;You&rdquo; and &ldquo;your&rdquo; refer to any individual or entity using the Service.</p>

<h2>2. The Software</h2>
<p>FieldCraft is a JSON-driven form engine distributed as npm packages. It includes:</p>
<ul>
<li><strong>Open-source packages</strong> (<code>@squaredr/fieldcraft-core</code>, <code>@squaredr/fieldcraft-react</code>, <code>@squaredr/fieldcraft-adapters</code>, <code>@squaredr/fieldcraft-templates</code>) released under the <a href="/legal/license">MIT License</a>.</li>
<li><strong>Commercial packages</strong> (<code>@squaredr/fieldcraft-pro</code>) that require a paid licence for production use. The commercial software is licensed, not sold. All intellectual property rights remain with SquaredR.</li>
</ul>

<h2>3. Open-Source Packages</h2>
<p>The open-source packages are governed by the MIT License. Your rights and obligations for those packages are defined entirely by the MIT License &mdash; these Terms do not restrict or expand those rights.</p>

<h2 id="pro-licence">4. FieldCraft Pro &mdash; Commercial Licence</h2>

<h3>4.1 Licence Grant</h3>
<p>Upon purchase, SquaredR grants you a revocable, non-exclusive, non-transferable, limited licence to use the FieldCraft Pro package (<code>@squaredr/fieldcraft-pro</code>) on <strong>one (1) production domain</strong> per licence key purchased. This licence is perpetual for the version purchased &mdash; you may continue to use the version you bought indefinitely.</p>

<h3 id="production-domain">4.2 What Counts as a &ldquo;Production Domain&rdquo;</h3>
<p>A &ldquo;production domain&rdquo; is any domain, subdomain, or public URL where end users (people other than your development team) can access, view, or interact with forms rendered using FieldCraft Pro components. Examples:</p>
<ul>
<li><code>app.example.com</code> &mdash; production (requires a licence).</li>
<li><code>admin.example.com</code> on the same root domain &mdash; covered by the same licence. All subdomains of a single registered domain are treated as one production domain.</li>
<li><code>localhost</code>, <code>127.0.0.1</code>, <code>*.local</code>, Vercel preview deployments, staging environments &mdash; not production. No licence required.</li>
</ul>
<p>If you deploy to a second unrelated production domain (e.g. <code>anotherclient.com</code>), you need a second licence.</p>

<h3 id="free-evaluation">4.3 Free Evaluation</h3>
<p>FieldCraft Pro is designed to be fully evaluated before purchase. You may install the package from npm, use every component, render forms, test the builder, viewer, and theme editor on <code>localhost</code> and any non-production environment without a licence key and without any time limit. The only restriction is production deployment.</p>

<h3>4.4 Authentication and Credentials</h3>
<p>Your licence key is your sole credential for accessing FieldCraft Pro services (licence dashboard, support, and production validation). There are no email-based accounts or passwords.</p>
<p>During activation, you will be prompted to set up a <strong>time-based one-time password (TOTP)</strong> authenticator (e.g. Google Authenticator, Authy, or any TOTP-compatible app). Your licence key combined with your authenticator code constitutes your full identity in our system.</p>
<p><strong>You are solely responsible for:</strong></p>
<ul>
<li>Keeping your licence key confidential and secure.</li>
<li>Maintaining access to your TOTP authenticator device and backup codes.</li>
<li>Storing your licence key and backup codes in a safe location.</li>
</ul>
<p>SquaredR does not store your email address, name, or any other personally identifiable information in connection with your licence. If you lose both your licence key and your authenticator access, recovery requires verifying the original purchase through Gumroad (using your Gumroad transaction ID or purchase receipt). SquaredR cannot recover your credentials without proof of purchase from Gumroad.</p>

<h3>4.5 Updates and Support</h3>
<p>Each licence key includes <strong>twelve (12) months of updates</strong> from the date of purchase. During this period, you will receive all minor and patch releases (e.g. 1.5.x, 1.6.x). After twelve months, your licence key continues to work for the last version released within your update window, but you will not receive further updates unless you purchase an update extension.</p>
<p>Support is provided via email (<a href="mailto:hello@squaredr.tech">hello@squaredr.tech</a>) and our private issue tracker. To receive support, you must provide your licence key for verification. Support covers installation, configuration, and usage questions. We will make commercially reasonable efforts to respond within five (5) business days. Support does not include custom development, integration consulting, or guaranteed resolution of every issue.</p>

<h3 id="licence-restrictions">4.6 Restrictions</h3>
<p>You may <strong>not</strong>:</p>
<ul>
<li>Share, publish, or redistribute your licence key to any third party.</li>
<li>Resell, sublicence, lease, or transfer your licence to another person or entity.</li>
<li>Use FieldCraft Pro to build a product that directly competes with FieldCraft Pro (a form builder, response viewer, or theme editor sold or distributed as a standalone component library).</li>
<li>Reverse engineer, decompile, or disassemble any part of the commercial package, except to the extent that applicable law expressly permits such activity notwithstanding this limitation.</li>
<li>Remove, alter, or obscure any copyright notices, licence headers, or licence validation code in the software.</li>
<li>Redistribute the FieldCraft Pro source code or compiled output as part of an open-source project, template, starter kit, or boilerplate that others can install without purchasing their own licence.</li>
</ul>

<h2>5. Pricing and Payment</h2>

<h3>5.1 Prices</h3>
<p>All prices are listed in United States Dollars (USD) and are exclusive of applicable taxes. You are responsible for any VAT, GST, sales tax, or withholding tax imposed by your jurisdiction. Where required by law, the payment processor (Gumroad) may collect and remit taxes on our behalf.</p>

<h3>5.2 Payment Processing</h3>
<p>All payments are processed by <strong>Gumroad</strong>, a third-party payment platform. SquaredR does not directly collect, process, or store your credit card number, CVV, or full payment details. Your payment is subject to <a href="https://gumroad.com/terms" target="_blank" rel="noopener noreferrer">Gumroad&rsquo;s Terms of Service</a> and <a href="https://gumroad.com/privacy" target="_blank" rel="noopener noreferrer">Gumroad&rsquo;s Privacy Policy</a> in addition to these Terms.</p>

<h2 id="refund-policy">6. Refund Policy</h2>

<h3>6.1 No Refunds</h3>
<p><strong>All sales of FieldCraft Pro are final. We do not offer refunds, exchanges, or credits.</strong></p>
<p>This policy exists because FieldCraft Pro is intentionally designed to be fully tested before purchase:</p>
<ul>
<li>The complete package is available on npm for free installation.</li>
<li>Every component (FormBuilder, ResponseViewer, ThemeEditor) works fully on <code>localhost</code> and non-production environments.</li>
<li>There is no time limit on evaluation. You can test for days, weeks, or months before deciding to buy.</li>
<li>Live interactive demos are available on this website at <a href="/pro">/pro</a>.</li>
<li>Full documentation and API reference are available at <a href="/docs">/docs</a>.</li>
</ul>
<p>By completing your purchase, you acknowledge that you have had ample opportunity to evaluate the software and that you are making an informed decision. The purchase price is for a production licence key only &mdash; not for the software itself, which you already have.</p>

<h3>6.2 EU Buyers &mdash; Digital Content Acknowledgment</h3>
<p>If you are located in the European Union or European Economic Area, you acknowledge the following in accordance with Article 16(m) of the EU Consumer Rights Directive (Directive 2011/83/EU):</p>
<ul>
<li>FieldCraft Pro is digital content not supplied on a tangible medium.</li>
<li>Your licence key is delivered immediately upon purchase.</li>
<li>By completing your purchase, you expressly consent to the immediate delivery of the digital content.</li>
<li>You acknowledge that you thereby forfeit your fourteen (14) day right of withdrawal.</li>
</ul>

<h3>6.3 Exceptions</h3>
<p>If you are charged twice for the same licence due to a payment processing error, or if a technical issue prevents your licence key from being delivered after purchase, contact us at <a href="mailto:hello@squaredr.tech">hello@squaredr.tech</a> and we will resolve the issue. This may include issuing a replacement key or processing a refund for the duplicate charge. These exceptions apply only to payment and delivery errors, not to dissatisfaction with the product.</p>

<h3>6.4 Chargebacks</h3>
<p>Initiating a chargeback or payment dispute with your bank or credit card company after receiving a valid licence key is considered a material breach of these Terms. In the event of a chargeback, SquaredR reserves the right to immediately revoke your licence key, disable access to updates and support, and pursue recovery of the disputed amount plus any chargeback fees incurred.</p>

<h2>7. You Are Responsible for What You Build</h2>
<p>FieldCraft is a tool. What you build with it is entirely your responsibility. You are solely responsible for:</p>
<ul>
<li>The forms you create, the data you collect through them, and how you handle that data.</li>
<li>Complying with all laws and regulations that apply to your use case, including data protection and privacy laws (GDPR, CCPA, HIPAA, India DPDP Act, and any other applicable regulation).</li>
<li>Ensuring your applications are lawful and do not infringe the rights of others.</li>
</ul>
<p>SquaredR is not a party to the relationship between you and your users. We have no access to, control over, or responsibility for data collected through forms you build with FieldCraft.</p>

<h2>8. Intellectual Property</h2>
<p>The FieldCraft name, logo, and brand assets are the property of SquaredR. The MIT License grants rights to the open-source software but does not grant rights to use SquaredR trademarks, except as needed to accurately describe the origin of the software (e.g. &ldquo;built with FieldCraft&rdquo;).</p>
<p>Content you create using FieldCraft (form schemas, templates, applications, themes) is yours. We claim no ownership over it.</p>
<p>Website content (documentation, blog posts, tutorials) is copyrighted by SquaredR. Code examples in the documentation are MIT-licensed and can be freely used.</p>
<p>The FieldCraft Pro source code, compiled output, documentation, and all associated assets are proprietary and protected by copyright and intellectual property laws. The licence you purchase grants you a right to use the software, not ownership of it.</p>

<h2>9. No Warranty</h2>
<p>THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ACCURACY. SQUAREDR DOES NOT WARRANT THAT THE SOFTWARE WILL BE ERROR-FREE, SECURE, OR UNINTERRUPTED, OR THAT DEFECTS WILL BE CORRECTED. YOU USE IT AT YOUR OWN RISK.</p>
<p>No advice or information, whether oral or written, obtained from SquaredR or through the Service shall create any warranty not expressly stated in these Terms.</p>

<h2>10. Limitation of Liability</h2>
<p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SQUAREDR SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM OR RELATED TO YOUR USE OF OR INABILITY TO USE THE SERVICE, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS OPPORTUNITIES, EVEN IF SQUAREDR HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
<p>SQUAREDR&rsquo;S TOTAL CUMULATIVE LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU HAVE ACTUALLY PAID SQUAREDR IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR ONE HUNDRED UNITED STATES DOLLARS (US$100), WHICHEVER IS GREATER.</p>
<p>These limitations apply regardless of the legal theory on which the claim is based (contract, tort, negligence, strict liability, or otherwise) and even if a limited remedy set forth herein is found to have failed of its essential purpose.</p>

<h2>11. Indemnification</h2>
<p>You agree to indemnify, defend, and hold harmless SquaredR and its officers, directors, employees, contractors, and agents from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising from or related to:</p>
<ul>
<li>Your use of the Service or anything you build with it.</li>
<li>Your violation of these Terms.</li>
<li>Your violation of any applicable law, regulation, or third-party rights.</li>
<li>Any data you collect, process, or store using applications built with FieldCraft.</li>
<li>Any claim by a third party related to forms, applications, or services you create using FieldCraft.</li>
</ul>

<h2>12. Licence Revocation and Termination</h2>

<h3>12.1 For Cause (with Cure Period)</h3>
<p>If you breach any provision of these Terms (other than those listed in Section 12.2), SquaredR will provide written notice specifying the breach. You will have thirty (30) days from the date of notice to cure the breach. If the breach is not cured within this period, SquaredR may revoke your licence key and terminate your access to updates and support.</p>

<h3>12.2 Immediate Termination (No Cure Period)</h3>
<p>SquaredR may immediately revoke your licence key without notice or cure period in the following circumstances:</p>
<ul>
<li>Redistribution, sharing, or public disclosure of your licence key.</li>
<li>Redistribution of the FieldCraft Pro source code or compiled output.</li>
<li>Initiating a chargeback or fraudulent payment dispute.</li>
<li>Using the software for any unlawful purpose or in connection with illegal activity.</li>
</ul>

<h3>12.3 Effect of Termination</h3>
<p>Upon termination, you must cease all use of the commercial packages and destroy all copies in your possession. Your licence key will be deactivated. No refund is owed for terminated licences. Your rights under the MIT License for open-source packages are irrevocable and survive any termination.</p>

<h3>12.4 Survival</h3>
<p>Sections 6 (Refund Policy), 7 (Responsibility), 8 (Intellectual Property), 9 (No Warranty), 10 (Limitation of Liability), 11 (Indemnification), 13 (Governing Law and Dispute Resolution), and this Section 12 survive termination of these Terms.</p>

<h2>13. Governing Law and Dispute Resolution</h2>

<h3>13.1 Governing Law</h3>
<p>These Terms are governed by and construed in accordance with the laws of India, without regard to conflict of law principles.</p>

<h3>13.2 Dispute Resolution</h3>
<p>Any dispute, controversy, or claim arising out of or relating to these Terms, or the breach, termination, or invalidity thereof, shall be settled by binding arbitration in accordance with the Arbitration and Conciliation Act, 1996 (India). The arbitration shall be seated in Bengaluru, India, and conducted in English by a single arbitrator. The arbitrator&rsquo;s award shall be final and binding and may be entered as a judgment in any court of competent jurisdiction.</p>

<h3>13.3 Informal Resolution</h3>
<p>Before initiating arbitration, you agree to first attempt to resolve any dispute informally by contacting us at <a href="mailto:hello@squaredr.tech">hello@squaredr.tech</a>. We will attempt to resolve the dispute within thirty (30) days. If the dispute is not resolved informally, either party may proceed to arbitration.</p>

<h3>13.4 Class Action Waiver</h3>
<p>To the maximum extent permitted by applicable law, you agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action. If this class action waiver is found to be unenforceable in your jurisdiction, this entire arbitration provision shall be void solely with respect to you.</p>

<h3>13.5 Local Consumer Protections</h3>
<p>Nothing in these Terms shall override mandatory consumer protection rights granted to you by the laws of your country of residence, to the extent those rights cannot be waived by contract.</p>

<h2>14. Changes to These Terms</h2>
<p>We may update these Terms from time to time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. For material changes that affect your rights under an existing Pro licence, we will make commercially reasonable efforts to provide notice through Gumroad&rsquo;s product update notifications and through the FieldCraft Pro package itself (e.g. a console notice on update). Since SquaredR does not store your email address, we cannot notify you directly &mdash; check this page periodically if you are concerned. Continued use of the Service after changes are posted constitutes acceptance of the revised Terms.</p>

<h2>15. Severability</h2>
<p>If any provision of these Terms is found by a court or arbitrator of competent jurisdiction to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid, legal, and enforceable while preserving its original intent.</p>

<h2>16. Entire Agreement</h2>
<p>These Terms, together with the <a href="/legal/privacy">Privacy Policy</a>, the <a href="/legal/license">MIT License</a> (for open-source packages), and any purchase confirmation from Gumroad, constitute the entire agreement between you and SquaredR regarding the Service. They supersede all prior agreements, understandings, and representations.</p>

<h2>17. Contact</h2>
<p>Questions about these Terms, licence enquiries, or dispute resolution:</p>
<ul>
<li>Email: <a href="mailto:hello@squaredr.tech">hello@squaredr.tech</a></li>
<li>Website: <a href="/pro">/pro</a> (contact form)</li>
</ul>
    `.trim(),
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    lastUpdated: '2026-08-21',
    content: `
<h2>1. Who We Are</h2>
<p>FieldCraft is maintained by <strong>SquaredR</strong>, based in India. For the purposes of data protection law (including the EU General Data Protection Regulation and the India Digital Personal Data Protection Act, 2023), SquaredR is the <strong>data controller</strong> for personal data collected through this website (contact form submissions and support correspondence). SquaredR does not store any personally identifiable information from licence purchases &mdash; buyer identity and payment data are held exclusively by Gumroad.</p>
<p>Contact: <a href="mailto:hello@squaredr.tech">hello@squaredr.tech</a></p>

<h2>2. What This Policy Covers</h2>
<p>This Privacy Policy covers the FieldCraft website (fieldcraft.squaredr.tech), the licence purchase process via Gumroad, and the npm package distribution. It does <strong>not</strong> cover what you do with FieldCraft after you install it &mdash; you are the data controller for any data your applications collect, and you must provide your own privacy policy to your end users.</p>

<h2>3. Data We Collect</h2>
<p>We collect very little data. Here is a complete list of what we process, why, and on what legal basis.</p>

<h3>3.1 Website Visits</h3>
<p>The FieldCraft website does not:</p>
<ul>
<li>Set cookies (tracking, analytics, session, or otherwise).</li>
<li>Run third-party tracking scripts (no Google Analytics, no Facebook Pixel, no ad networks).</li>
<li>Require user accounts or logins.</li>
<li>Use fingerprinting or any other tracking technique.</li>
</ul>
<p>The website is hosted on <strong>Vercel</strong>. As part of standard web infrastructure, Vercel automatically processes server logs that include your IP address, browser type, operating system, referrer URL, and request timestamps. These logs are retained by Vercel for up to 24 hours and then automatically deleted. SquaredR does not have direct access to Vercel&rsquo;s raw server logs.</p>
<p><strong>Legal basis:</strong> Legitimate interest (GDPR Art. 6(1)(f)) &mdash; necessary for website security, stability, and abuse prevention. This processing is performed by Vercel as a data processor on our behalf.</p>

<h3>3.2 Contact Form Submissions</h3>
<p>The <a href="/pro">Pro page</a> includes a contact form built with FieldCraft itself. When you submit this form, we collect the information you provide (typically your name, email address, company, area of interest, and message).</p>
<p>Your submission is forwarded as an email via <strong>Resend</strong>, a third-party transactional email service. The email is sent from our verified domain (<code>noreply@squaredr.tech</code>) to our internal address. <strong>SquaredR does not operate a persistent mailbox or email inbox.</strong> Resend acts as a relay: it delivers the email and retains a copy on its infrastructure for up to <strong>thirty (30) days</strong>, after which it is automatically and permanently deleted by Resend. SquaredR does not separately store, back up, or archive contact form submissions in any database.</p>
<p>This means that if you contact us, your name, email address, and message will exist only within the Resend platform for up to 30 days. If we have not read and responded to your enquiry within that window, the submission is permanently lost.</p>
<p><strong>Purpose:</strong> To respond to your enquiry.</p>
<p><strong>Legal basis:</strong> Legitimate interest (GDPR Art. 6(1)(f)) &mdash; necessary to respond to a direct communication you initiated.</p>
<p><strong>Retention:</strong> Up to 30 days (Resend&rsquo;s automatic retention period), then permanently deleted. SquaredR does not maintain any independent copy. We do not add your email address to any marketing list, newsletter, or database unless you explicitly request it.</p>

<h3>3.3 Licence Purchase Data</h3>
<p>When you purchase FieldCraft Pro, the payment is processed by <strong>Gumroad</strong> (a third-party payment platform). SquaredR does <strong>not</strong> collect, process, or store your credit card number, CVV, full payment details, email address, or name. All buyer identity and payment information is held exclusively by Gumroad.</p>
<p>When a purchase occurs, Gumroad sends a webhook notification to our backend. This notification is used <strong>transiently</strong> to generate your licence key. The only data we extract and persist is:</p>
<ul>
<li>A Gumroad transaction reference ID (an opaque string that links to the purchase on Gumroad&rsquo;s side).</li>
<li>Purchase date.</li>
<li>Product purchased.</li>
</ul>
<p>Your email address and name, which may be included in the Gumroad webhook payload, are <strong>not persisted</strong> in our database. They are discarded after the licence key is generated and delivered via Gumroad. SquaredR has no ongoing record of who you are &mdash; only that a valid purchase was made.</p>
<p><strong>Legal basis:</strong> Not applicable &mdash; no personal data is stored by SquaredR. The Gumroad transaction reference ID is an opaque identifier that cannot be used to identify a natural person without access to Gumroad&rsquo;s records.</p>

<h3>3.4 Licence Key Data</h3>
<p>Each licence key is associated with the following <strong>non-personal</strong> information in our database:</p>
<ul>
<li>Licence key (a randomly generated opaque string).</li>
<li>Gumroad transaction reference ID.</li>
<li>Purchase date.</li>
<li>Licensed production domain(s).</li>
<li>Activation status and activation date.</li>
<li>Update eligibility expiry date.</li>
<li>TOTP authenticator secret (encrypted).</li>
</ul>
<p><strong>None of the above constitutes personal data.</strong> The licence key is a random string, the domain is a business asset (not a person), and the TOTP secret is encrypted and cannot identify an individual.</p>
<p>When you activate FieldCraft Pro on a production domain, the licence validation process transmits your licence key and the domain name to our validation endpoint. This is necessary to verify that the licence is valid for that domain. No IP addresses, browser fingerprints, or other identifying data are logged by this endpoint. Only the key, domain, timestamp, and validation result (pass/fail) are recorded.</p>

<h3>3.5 Support Correspondence</h3>
<p>If you contact us via email for support, bug reports, or licence enquiries, we retain the correspondence to provide ongoing support and maintain context for follow-up issues.</p>
<p><strong>Retention:</strong> Support correspondence is retained for two (2) years after the last communication, then deleted.</p>
<p><strong>Legal basis:</strong> Legitimate interest (GDPR Art. 6(1)(f)) &mdash; necessary to provide support and resolve potential disputes.</p>

<h3>3.6 npm Package Telemetry</h3>
<p>The FieldCraft npm packages display a console banner showing the version number on first load. This is a local <code>console.log</code> statement only &mdash; no network request is made and no data is sent to SquaredR or any third party.</p>
<p>The website hosts an optional, anonymous telemetry endpoint that counts aggregate installs. This endpoint receives <strong>no personally identifiable information</strong> &mdash; only a package name and version string. No IP addresses are logged by this endpoint. This telemetry can be fully disabled by setting the <code>FIELDCRAFT_TELEMETRY_DISABLED</code> environment variable before importing the package.</p>
<p><strong>Legal basis:</strong> Legitimate interest (GDPR Art. 6(1)(f)) &mdash; understanding aggregate adoption to prioritise development.</p>

<h3 id="cookies">3.7 Cookies and Analytics Consent</h3>
<p>This website uses <strong>Google Analytics</strong> (via Google Tag Manager) for basic page-view analytics only. We do <strong>not</strong> use Google Analytics for advertising, remarketing, user profiling, or cross-site tracking. Google Analytics uses cookies to distinguish unique visitors and track page views.</p>
<p>In compliance with the EU ePrivacy Directive, UK PECR, and Google&rsquo;s Consent Mode v2 requirements, analytics cookies are <strong>blocked by default</strong> until you provide explicit consent. When you first visit the site, a consent banner appears at the bottom of the page. You may:</p>
<ul>
<li><strong>Accept:</strong> Analytics cookies are enabled. Google Analytics receives anonymised page-view data (page URL, referrer, browser type, screen resolution, approximate geographic region). No personally identifiable information is collected or sent to Google.</li>
<li><strong>Decline:</strong> Analytics cookies remain blocked. Google Analytics receives no data. Your choice is recorded in a cookie (<code>fc_consent</code>) so the banner does not reappear.</li>
</ul>
<p>The consent cookie (<code>fc_consent</code>) itself is a first-party, strictly necessary cookie that records your consent preference (granted or denied). It contains no personal data, does not track you, and expires after one (1) year. You can change your preference at any time by clearing the <code>fc_consent</code> cookie from your browser and reloading the page.</p>
<p><strong>Google&rsquo;s Consent Mode v2:</strong> We implement Google Consent Mode v2 with the following default state: <code>analytics_storage: denied</code>, <code>ad_storage: denied</code>, <code>ad_user_data: denied</code>, <code>ad_personalization: denied</code>. When you accept cookies, only <code>analytics_storage</code> is updated to <code>granted</code>. Advertising signals remain permanently denied &mdash; we do not use Google Ads or any advertising platform.</p>
<p><strong>Legal basis:</strong> Consent (GDPR Art. 6(1)(a)) &mdash; analytics cookies are only set after your explicit opt-in.</p>

<h2>4. Data We Do Not Collect or Store</h2>
<p>To be explicit, SquaredR does <strong>not</strong>:</p>
<ul>
<li>Store buyer email addresses, names, or any personally identifiable information from licence purchases. This data is held exclusively by Gumroad.</li>
<li>Collect or store credit card numbers, bank account details, or any payment instrument data.</li>
<li>Maintain user accounts with email/password credentials. Your licence key and TOTP authenticator are your sole credentials.</li>
<li>Access, collect, or store any data submitted through forms you build with FieldCraft. All form submission data stays on your infrastructure.</li>
<li>Track your browsing behaviour across websites. On-site page-view analytics (Google Analytics) are consent-gated and anonymised &mdash; see <a href="#cookies">Section 3.7</a>.</li>
<li>Log IP addresses during licence validation requests.</li>
<li>Sell, rent, or share personal data with advertisers or data brokers.</li>
<li>Create user profiles or segments for advertising purposes.</li>
<li>Use automated decision-making or profiling that produces legal or similarly significant effects.</li>
</ul>

<h2>5. Third-Party Services and Data Processors</h2>
<p>We use a limited number of third-party services. Each is listed below with their role and relevant privacy policy:</p>

<table>
<thead>
<tr><th>Service</th><th>Role</th><th>Data Shared</th><th>Privacy Policy</th></tr>
</thead>
<tbody>
<tr><td><strong>Vercel</strong></td><td>Website hosting</td><td>IP address, request metadata (server logs, auto-deleted after 24h)</td><td><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a></td></tr>
<tr><td><strong>Gumroad</strong></td><td>Payment processing and buyer identity</td><td>Name, email, payment details (held exclusively by Gumroad; SquaredR receives only a transaction reference ID)</td><td><a href="https://gumroad.com/privacy" target="_blank" rel="noopener noreferrer">Gumroad Privacy Policy</a></td></tr>
<tr><td><strong>Resend</strong></td><td>Transactional email relay (contact form)</td><td>Name, email address, message content (retained for up to 30 days, then auto-deleted; no persistent mailbox)</td><td><a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Resend Privacy Policy</a></td></tr>
<tr><td><strong>Google Analytics</strong></td><td>Page-view analytics (consent-gated)</td><td>Anonymised page views, browser type, screen resolution, approximate region (only with your consent; no PII)</td><td><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></td></tr>
<tr><td><strong>npm (GitHub/Microsoft)</strong></td><td>Package distribution</td><td>Standard registry access logs</td><td><a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub Privacy Statement</a></td></tr>
</tbody>
</table>

<p>We do not use any third-party analytics, advertising, marketing, or customer data platforms beyond the services listed above.</p>

<h2>6. International Data Transfers</h2>
<p>SquaredR is based in India. Vercel processes website data in the United States and other regions. Gumroad processes payment data in the United States. Resend processes contact form emails in the United States.</p>
<p>For transfers of personal data from the European Economic Area (EEA), United Kingdom, or Switzerland to countries that have not received an adequacy decision from the European Commission, the following safeguards apply:</p>
<ul>
<li><strong>Vercel:</strong> EU Standard Contractual Clauses (SCCs) and EU-US Data Privacy Framework certification.</li>
<li><strong>Gumroad:</strong> EU Standard Contractual Clauses (SCCs) as part of their terms of service.</li>
<li><strong>Resend:</strong> EU-US Data Privacy Framework certification. Contact form data is retained for up to 30 days, then auto-deleted.</li>
<li><strong>Google (Analytics):</strong> EU-US Data Privacy Framework certification. Analytics data is only transmitted with your explicit consent.</li>
<li><strong>SquaredR (India):</strong> Where we process personal data of EEA residents, we rely on the EU Standard Contractual Clauses. India has not received an EU adequacy decision as of the date of this policy.</li>
</ul>

<h2>7. Data Retention Summary</h2>
<table>
<thead>
<tr><th>Data Category</th><th>Retention Period</th><th>Justification</th></tr>
</thead>
<tbody>
<tr><td>Server logs (Vercel)</td><td>24 hours</td><td>Vercel&rsquo;s automatic deletion; infrastructure security</td></tr>
<tr><td>Contact form submissions (Resend)</td><td>30 days (auto-deleted by Resend)</td><td>No SquaredR copy; Resend retains for delivery/debugging, then permanently deletes</td></tr>
<tr><td>Support correspondence</td><td>2 years after last communication</td><td>Ongoing relationship; potential disputes</td></tr>
<tr><td>Licence key data (non-personal)</td><td>Duration of licence</td><td>Licence validation and abuse prevention; no PII involved</td></tr>
<tr><td>Validation logs (non-personal)</td><td>12 months</td><td>Abuse detection; contains only key, domain, timestamp, result</td></tr>
<tr><td>Telemetry (aggregate installs)</td><td>Indefinite (anonymised, non-personal)</td><td>No personal data involved</td></tr>
<tr><td>Consent cookie (<code>fc_consent</code>)</td><td>1 year</td><td>Records your analytics consent preference (granted or denied); strictly necessary, no PII</td></tr>
</tbody>
</table>

<h2>8. Your Rights</h2>
<p>Depending on your location, you may have the following rights regarding your personal data:</p>

<h3>8.1 Under the EU General Data Protection Regulation (GDPR)</h3>
<ul>
<li><strong>Right of access</strong> (Art. 15) &mdash; Request a copy of all personal data we hold about you.</li>
<li><strong>Right to rectification</strong> (Art. 16) &mdash; Request correction of inaccurate personal data.</li>
<li><strong>Right to erasure</strong> (Art. 17) &mdash; Request deletion of your personal data, subject to legitimate retention obligations (e.g. tax records).</li>
<li><strong>Right to restriction of processing</strong> (Art. 18) &mdash; Request that we stop processing your data while a dispute is being resolved.</li>
<li><strong>Right to data portability</strong> (Art. 20) &mdash; Request your data in a structured, commonly used, machine-readable format.</li>
<li><strong>Right to object</strong> (Art. 21) &mdash; Object to processing based on legitimate interest. We will cease processing unless we demonstrate compelling legitimate grounds.</li>
<li><strong>Right to lodge a complaint</strong> &mdash; You may file a complaint with a supervisory authority in your EU/EEA member state.</li>
</ul>

<h3>8.2 Under the India Digital Personal Data Protection Act, 2023 (DPDP Act)</h3>
<ul>
<li><strong>Right to access information</strong> &mdash; Request a summary of your personal data and processing activities.</li>
<li><strong>Right to correction and erasure</strong> &mdash; Request correction of inaccurate data or erasure of data no longer necessary for the purpose it was collected.</li>
<li><strong>Right to grievance redressal</strong> &mdash; You may contact our grievance officer (details below) or the Data Protection Board of India.</li>
<li><strong>Right to nominate</strong> &mdash; Nominate another person to exercise your rights in the event of your death or incapacity.</li>
</ul>

<h3>8.3 Under the California Consumer Privacy Act (CCPA)</h3>
<p>If you are a California resident, you have the right to know what personal information we collect, request deletion, and opt out of any sale of personal information. <strong>We do not sell personal information.</strong></p>

<h3>8.4 How to Exercise Your Rights</h3>
<p>To exercise any of these rights, email us at <a href="mailto:hello@squaredr.tech">hello@squaredr.tech</a> with the subject line &ldquo;Data Subject Request&rdquo;. We will verify your identity and respond within thirty (30) days. If we need more time due to the complexity of your request, we will notify you within the initial 30-day period and may extend by up to sixty (60) additional days.</p>
<p>For erasure requests, please note:</p>
<ul>
<li>Contact form data is held by Resend (not SquaredR) and is automatically deleted after 30 days. SquaredR does not maintain an independent copy. Support correspondence via email can be deleted upon request.</li>
<li>Our licence system does not contain any personal data (no email, no name, no IP addresses). There is nothing to erase, access, or port from the licence database.</li>
<li>Your purchase records, email address, and payment details are held by Gumroad, not by SquaredR. To exercise data subject rights over that data, you must contact Gumroad directly via their <a href="https://gumroad.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</li>
</ul>

<h2>9. Your Data in FieldCraft Deployments</h2>
<p>When you use FieldCraft to build forms, <strong>all form submission data stays on your infrastructure</strong>. SquaredR has zero access to it. You are the data controller for that data and are solely responsible for:</p>
<ul>
<li>How you collect, store, and process data submitted through forms you build with FieldCraft.</li>
<li>Complying with all applicable data protection laws (GDPR, CCPA, DPDP Act, HIPAA, or any other regulation relevant to your use case).</li>
<li>Providing your own privacy policy to your end users.</li>
<li>Implementing appropriate technical and organisational security measures for data you collect.</li>
</ul>
<p>SquaredR provides a form rendering tool. We are not a data processor, sub-processor, or any other party in the data processing chain for data your applications collect. We bear no responsibility for how you handle your users&rsquo; data.</p>

<h2>10. Children</h2>
<p>The FieldCraft website and npm packages are developer tools not directed at children under the age of 16 (or the applicable age of digital consent in your jurisdiction). We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, contact us at <a href="mailto:hello@squaredr.tech">hello@squaredr.tech</a> and we will delete it promptly.</p>

<h2>11. Security</h2>
<p>We implement appropriate technical and organisational measures to protect the data we process, including:</p>
<ul>
<li>All data in transit is encrypted using TLS (HTTPS).</li>
<li>Licence key validation uses secure, encrypted connections.</li>
<li>TOTP authenticator secrets are encrypted at rest in our database.</li>
<li>Our licence database contains no personally identifiable information, which significantly reduces the impact of any potential data breach.</li>
<li>We do not store payment instrument data or buyer identity data (this is handled entirely by Gumroad&rsquo;s PCI-compliant infrastructure).</li>
</ul>
<p>No method of transmission or storage is 100% secure. If we become aware of a data breach affecting personal data (e.g. contact form submissions or support correspondence), we will notify affected individuals and the relevant supervisory authorities as required by applicable law (including the Data Protection Board of India under the DPDP Act and supervisory authorities under the GDPR) without undue delay. A breach of our licence database would not constitute a personal data breach, as it contains no information that can identify a natural person.</p>

<h2>12. Changes to This Policy</h2>
<p>We may update this Privacy Policy if our data practices change (e.g. if we add analytics, a newsletter, or a new payment processor). Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. Since SquaredR does not store email addresses, we cannot notify you directly of changes. For material changes, we will provide notice through Gumroad&rsquo;s product update notifications and through the FieldCraft Pro package itself (e.g. a console notice on update). Check this page periodically if you are concerned.</p>

<h2>13. Grievance Officer (India DPDP Act)</h2>
<p>In accordance with the Digital Personal Data Protection Act, 2023, the following person is designated as the Grievance Officer for the purposes of this policy:</p>
<ul>
<li><strong>Name:</strong> SquaredR Grievance Officer</li>
<li><strong>Email:</strong> <a href="mailto:hello@squaredr.tech">hello@squaredr.tech</a></li>
</ul>
<p>The Grievance Officer will acknowledge your complaint within 48 hours and resolve it within thirty (30) days.</p>

<h2>14. Contact</h2>
<p>For any questions, concerns, or requests related to this Privacy Policy or your personal data:</p>
<ul>
<li><strong>Email:</strong> <a href="mailto:hello@squaredr.tech">hello@squaredr.tech</a></li>
<li><strong>Website:</strong> <a href="/pro">/pro</a> (contact form)</li>
<li><strong>Subject line for data requests:</strong> &ldquo;Data Subject Request&rdquo;</li>
</ul>
    `.trim(),
  },
];

export function getLegalPageBySlug(slug: string): LegalPage | undefined {
  return legalPages.find((p) => p.slug === slug);
}

export function getAllLegalSlugs(): string[] {
  return legalPages.map((p) => p.slug);
}
