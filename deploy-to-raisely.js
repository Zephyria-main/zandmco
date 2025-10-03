const fs = require('fs');
const path = require('path');

// Read Raisely configuration from .raisely.json
const raiselyConfig = JSON.parse(fs.readFileSync('.raisely.json', 'utf8'));

// Raisely API configuration
const RAISELY_CONFIG = {
    apiUrl: raiselyConfig.apiUrl,
    token: raiselyConfig.token,
    campaignUuid: raiselyConfig.campaigns[0],
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
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    content: combinedHTML
                }
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('🎉 Successfully deployed to Raisely!');
            console.log('📄 Page updated:', result.data?.name || 'Homepage');
            console.log('🔗 View your page at: https://raisely.com/zandmco');
        } else {
            const errorText = await response.text();
            console.error('❌ Deployment failed:', response.status, response.statusText);
            console.error('📝 Error details:', errorText);
            
            // Try to parse error as JSON for better formatting
            try {
                const errorJson = JSON.parse(errorText);
                console.error('🔍 Parsed error:', JSON.stringify(errorJson, null, 2));
            } catch (e) {
                console.error('📄 Raw error response:', errorText);
            }
        }
        
    } catch (error) {
        console.error('❌ Error during deployment:', error.message);
    }
}

// Run the deployment
deployToRaisely();
