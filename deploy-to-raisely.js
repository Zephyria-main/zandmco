const fs = require('fs');
const path = require('path');

// Raisely API configuration
const RAISELY_CONFIG = {
    apiUrl: 'https://api.raisely.com',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblV1aWQiOiI2NGU1NTVmMC05ZjY1LTExZjAtYmU4OC03MzQxNmQyODE5ODIiLCJleHAiOjE3NjA2MDE0MjguMTg0LCJpYXQiOjE3NTkzOTE4Mjh9.OIsYeO64MGjp54ESmTI-tamobVIONWI2Bcfrc9WKwZg',
    campaignUuid: 'a7d377a0-981e-11f0-b4e8-972118eb4936',
    pageUuid: 'a7fe3120-981e-11f0-bb0e-bd154af9cf51'
};

async function deployToRaisely() {
    try {
        console.log('🚀 Starting deployment to Raisely...');
        
        // Read the HTML content
        const htmlContent = fs.readFileSync('index.html', 'utf8');
        console.log('✅ HTML content loaded');
        
        // Read the CSS content
        const cssContent = fs.readFileSync('styles.css', 'utf8');
        console.log('✅ CSS content loaded');
        
        // Combine HTML and CSS into a single HTML file
        const combinedHTML = htmlContent.replace(
            '<link rel="stylesheet" href="styles.css">',
            `<style>${cssContent}</style>`
        );
        
        console.log('✅ HTML and CSS combined');
        
        // Update the page content via Raisely API
        const response = await fetch(`${RAISELY_CONFIG.apiUrl}/v3/pages/${RAISELY_CONFIG.pageUuid}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${RAISELY_CONFIG.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: combinedHTML
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('🎉 Successfully deployed to Raisely!');
            console.log('📄 Page updated:', result.data?.name || 'Homepage');
            console.log('🔗 View your page at: https://raisely.com/zandmco');
        } else {
            const error = await response.text();
            console.error('❌ Deployment failed:', response.status, error);
        }
        
    } catch (error) {
        console.error('❌ Error during deployment:', error.message);
    }
}

// Run the deployment
deployToRaisely();
