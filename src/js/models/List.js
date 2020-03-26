import uniqid from 'uniqid'

export default class {
    constructor() {
        // hold list of ingredients
        this.items = []
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count: count.toFixed(2),
            unit,
            ingredient
        }
        this.items.push(item)
        return item
    }

    deleteItem(id) {
        const index = this.items.findIndex(element => (element.id === id))
        return this.items.splice(index, 1)
    }

    updateCount(id, newCount) {
        this.items.find(element => element.id === id).count = newCount
    }
}