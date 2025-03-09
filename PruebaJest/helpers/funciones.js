const findUserById = (array, id) => {
    return array.find((object) => object.id === id);
    }
const deleteUserById = (array, id) => {
    return array.filter((object) => object.id != id);
    }

module.exports = {
    findUserById,
    deleteUserById
}