
const { AutotaskClient } = require('defender-autotask-client'); 
const client = new AutotaskClient({ 
	apiKey: process.env.DEFENDER_API_KEY,
    apiSecret: process.env.DEFENDER_SECRET_KEY,
});

const create = async function(){
	const encodeCode =  await client.getEncodedZippedCodeFromFolder('./code')

	const myAutoTask = {
	
		name: "Send Rewards Autotask",
	        encodedZippedCode: encodeCode,
		trigger:{ 
			type: 'webhook', 
		},
		paused: false,
	
	}
	try{
		await client.create(myAutoTask);	
//		console.log(myAutoTask);
		
	}catch(error){console.log(error)}
//	await client.create(myAutoTask)

}
create();
