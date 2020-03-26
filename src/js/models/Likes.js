export default class {
    constructor() {
        this.likes = []
    }

    addLike(id, title, publisher, img) {
        const like = {
            id,
            title,
            publisher,
            img
        }
        this.likes.push(like)
        // persist data in local storage
        this.persistData()
        return like
    }

    deleteLike(id) {
        const index = this.likes.findIndex(element => (element.id === id))
        this.likes.splice(index, 1)
        // persist data in local storage
        this.persistData()
    }

    isLiked(id) {
        return this.likes.findIndex(element => (element.id === id)) !== -1
    }

    getNumOfLikes() {
        return this.likes.length
    }

    updateCount(id, newCount) {
        this.likes.find(element => element.id === id).count = newCount
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes))
    }

    readStorage() {
        // restoring data from local storage
        const localData = JSON.parse(localStorage.getItem('likes'))
        if (localData) {
            this.likes = localData
        }
    }
}