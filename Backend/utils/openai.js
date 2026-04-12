import 'dotenv/config';

const getOpenAPIResponse = async(message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: message,
            }]
        })
    }

    try {
        const response = await fetch("https://api.chatanywhere.tech/v1/chat/completions", options);
        const data = await response.json();
        console.log(data);
        return data.choices[0].message.content;
    } catch(err) {
        console.log(err);
    }
}

export default getOpenAPIResponse;