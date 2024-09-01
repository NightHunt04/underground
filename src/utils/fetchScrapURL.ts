import axios from 'axios'

export default async function fetchScrapURL(title: string, content: string) {

    // let content = ''
    // contents.forEach(cont => content += cont + ', ')

    let prompt = 'User: Topics containing - ' + title + '\nContent: ' + content

    console.log('prompt', prompt)

    const options = {
        method: 'GET',
        url: 'https://web-search30.p.rapidapi.com/',
        params: {
          q: prompt,
          limit: '5'
        },
        headers: {
          'x-rapidapi-key': '7264c0698emsh8e04d51884fb66ep1a08f0jsnd21ad7509f71',
          'x-rapidapi-host': 'web-search30.p.rapidapi.com'
        }
      };
      
      try {
          const response = await axios.request(options)
          console.log(response.data.results)

          return response.data.results
      } catch (error) {
          console.error(error);
      }
}
