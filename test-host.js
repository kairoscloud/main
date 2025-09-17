// Start series of functions
ghlToken();

// Get GHL token
async function ghlToken() {
    const errors = [];
    const tokens = {};
    const url = 'https://getghltoken-xxvu4qktma-uc.a.run.app/';
    try {
        const ghlToken = await customRequest.get(url);
        tokens.ghl = ghlToken.data.ghlToken;
        console.log("ghlToken:", JSON.stringify(tokens.ghl));
        outputFunc(errors, tokens);
    } catch (error) {
        console.log("ghlToken:", error);
        errors.push({
            ghlToken: error
        });
        outputFunc(errors);
    }
}

// Compile user info for workflow output
async function outputFunc(errors, tokens) {
    if (errors.length === 0) {
        output = {
            errors: errors.length,
            tokens: tokens
        }
    } else {
        output = {
            errors: errors.length,
            error_messages: JSON.stringify(errors)
        }
    }
}
