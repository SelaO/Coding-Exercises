const TIME_PER_ROUTE = {
    'https://google.com': 100,
    'https://cisco.com': 1000,
    'https://facebook.com': 500,
};

const apiCall = (url) =>
    new Promise((res, rej) => {
        setTimeout(() => {
            const chance = Math.floor(Math.random() * 10);
            if (chance < 5) {
                res(TIME_PER_ROUTE[url]);
            } else {
                rej('API error');
            }
        }, TIME_PER_ROUTE[url]);
    });

const doQuery = async () => {

    const urls = ['https://google.com', 'https://cisco.com', 'https://facebook.com'];

    console.log('Before the API calls');

    const result = await Promise.all(urls.map(e => apiCall(e)
    .then(res => console.log(`response for the URL: ${e} : ${res}`))
    .catch(err => console.log(`${e} : ${err}`))))

    console.log('After the API calls');
};

doQuery();



const apiCall = (url) =>
    new Promise((res, rej) => {
        setTimeout(() => {
                res(TIME_PER_ROUTE[url]);
        }, 100);
    });


    const TIME_PER_ROUTE = {
        'https://google.com': 100,
        'https://cisco.com': 1000,
        'https://facebook.com': 500,
    };
    
    const apiCall = (url) =>
        new Promise((res, rej) => {
            setTimeout(() => {
                    res(TIME_PER_ROUTE[url]);
            }, TIME_PER_ROUTE[url]);
        });
