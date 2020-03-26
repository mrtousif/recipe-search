import Axios from "axios";

export default class {
    constructor(id) {
        this.id = id
    }

    async getRecipe() {
        try {
            const response = await Axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`)
            this.title = response.data.recipe.title
            this.publisher = response.data.recipe.publisher
            this.img = response.data.recipe.image_url
            this.url = response.data.recipe.source_url
            this.ingredients = response.data.recipe.ingredients
        } catch (error) {
            console.error(error);
        }
    }

    calcTime() {
        // assuming we need 15 min for each 3 ingredients
        const numOfIng = this.ingredients.length
        const periods = Math.ceil(numOfIng / 3)
        this.time = periods * 15
    }

    calcServing() {
        this.servings = 4
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'gram', 'kilogram']
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound', 'g', 'kg']

        const newIngredients = this.ingredients.map(element => {
            // 1. uniform units
            let ingredient = element.toLowerCase()
            unitsLong.forEach((unit, index) => {
                ingredient = ingredient.replace(unit, unitsShort[index])
            })
            // 2. Remove paranthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ')

            // 3. Parse ingredients into count, unit, ingredient
            const arrIng = ingredient.split(' ')
            const unitIndex = arrIng.findIndex(element => unitsShort.includes(element))
            let objIng

            if (unitIndex > -1) { // there is a unit
                // 4 cups ... then arrCount = [4]
                // 4 1/2 cups ... then arrCount = [4, 1/2]
                const arrCount = arrIng.slice(0, unitIndex)
                let count

                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'))
                } else {
                    count = eval(arrCount.join('+'))
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)) { // there is qty but no unit
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) { // there is no qty, no unit
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng
        })

        this.ingredients = newIngredients
    }

    updateServings(type) {
        // servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1

        // ingredients
        this.ingredients.forEach(element => {
            element.count *= (newServings / this.servings)
        });
        this.servings = newServings
    }
}