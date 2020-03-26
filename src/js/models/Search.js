import Axios from 'axios'


export default class {
    constructor(query) {
        this.query = query
    }

    async getResults() {
        try {
            const result = await Axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`)
            this.result = result.data.recipes

            return this.result
        } catch (error) {
            console.error(error)
        }
    }
}