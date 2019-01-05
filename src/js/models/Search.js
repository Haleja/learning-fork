import axios from 'axios';
import { key, proxyA, proxyB} from '../config';
    //https://www.food2fork.com/api/search
    //https://www.food2fork.com/api/get 

export default class Search {

    constructor(query) {
        this.query = query;
    }


    async getResults() {


        try {
            const result = await axios(`${proxyA}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`)
            this.recipes = result.data.recipes
            //console.log(this.recipes);
        } catch (error) {
            alert(error)
        }
    }


}