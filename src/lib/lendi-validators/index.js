import fetch from 'node-fetch';

/*
 * Custom validators
 */
export const customValidators = {
	// Check if access token used to login is valid
	hasValidAccessToken: (accessToken, provider) => {
		return new Promise((resolve, reject) => {
			switch (provider) {
				case 'facebook':
					fetch(`https://graph.facebook.com/me?access_token=${accessToken}`)
						.then((res) => {
							console.log('--------- Facebook response', res);
							if (res.status === 200) {
								resolve(res);	
							} else {
								reject(err);
							}
						})
						.catch((err) => {
							if (err) {
								reject(err);
							}
						});
					break;
				case 'google':
					fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`)
						.then((res) => {
							console.log('--------- Google response', res);
							if (res.status === 200) {
								resolve(res);	
							} else {
								reject(err);
							}
						})
						.catch((err) => {
							if (err) {
								reject(err);
							}
						});
					break;
				default:
					reject();
			}
		});
    }
}
