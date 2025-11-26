# Placeholder Music Website

A personal music artist website featuring a bio landing page, music links, email subscription, and contact form.

## Features

- **Landing Page (index.html)**: Artist bio and introduction with animated hero section
- **Music Links (links.html)**: Links to all major streaming platforms and social media
- **Subscribe (subscribe.html)**: Email list signup with Google Sheets integration
- **Contact (contact.html)**: Contact form and information

## Unique Styling & Animations

- Animated floating gradient shapes with mouse parallax
- Smooth scroll animations using Intersection Observer
- Responsive navigation with hamburger menu
- Custom button ripple effects
- Glassmorphism design elements
- Platform-specific hover colors for music links

## Google Sheets Integration Setup

To store email subscribers in a Google Sheet:

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name the first sheet "Subscribers"
4. Add headers in row 1: `First Name`, `Last Name`, `Email`, `Timestamp`

### Step 2: Create Google Apps Script
1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any code in the editor and paste the following:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Subscribers');
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.firstName,
    data.lastName,
    data.email,
    data.timestamp
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({status: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Deploy > New deployment**
4. Select **Web app** as the type
5. Set **Execute as**: Me
6. Set **Who has access**: Anyone
7. Click **Deploy** and copy the Web app URL

### Step 3: Update Website
1. Open `script.js`
2. Find the line: `const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';`
3. Replace with your actual Google Apps Script URL

## Local Development

Simply open `index.html` in a web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve
```

## Customization

- **Colors**: Edit CSS variables in `styles.css` under `:root`
- **Content**: Update text in HTML files
- **Images**: Replace the image placeholder in `index.html`
- **Links**: Update `href` attributes in `links.html` with your actual music platform URLs
- **Contact Info**: Update email addresses in `contact.html`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

GNU General Public License v3.0