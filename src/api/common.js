import server from "../utils/request.js"

export function getLogin(obj) {
    return server({
        method: "POST",
        url: "/api/login",
        data: obj
    })
}
export function getUserList(obj) {
    return server({
        method: "GET",
        url: "api/manage/user/list",
        params: {...obj}
    })
}
export function deleteUser(obj) {
    return server({
        method: "POST",
        url: `api/manage/user/delete?userId=${obj}`,
        data: obj
    })
}
export function addUser(obj) {
    return server({
        method: "POST",
        url: `api/manage/user/add`,
        data: obj
    })
}
export function updateUser(obj) {
    return server({
        method: "POST",
        url: "api/manage/user/update",
        data: obj
    })
}
export function getRoleList(obj) {
    return server({
        method: "GET",
        url: `api/manage/role/list`,
        params: {...obj}
    })
}
export function createRole(obj) {
    return server({
        method: "POST",
        url: `api/manage/role/add`,
        data: obj
    })
}
export function updateRole(obj) {
    return server({
        method: "POST",
        url: `api/manage/role/update`,
        data: obj
    })
}
export function getCategoryList(obj) {
    return server({
        method: "GET",
        url: `api/manage/category/list`,
        params: {...obj}
    })
}
export function getCategoryInfo(obj) {
    return server({
        method: "GET",
        url: `api/manage/category/info`,
        params: {...obj}
    })
}
export function updateCategoryName(obj) {
    return server({
        method: "POST",
        url: `api/manage/category/update`,
        data: obj
    })
}
export function addCategory(obj) {
    return server({
        method: "POST",
        url: `api/manage/category/add`,
        data: obj
    })
}
export function getGoodsList(obj) {
    return server({
        method: "GET",
        url: "api/manage/product/list",
        params: {...obj}
    })
}
export function updateStatus(obj) {
    return server({
        method: "POST",
        url: `api/manage/product/updateStatus`,
        data: obj
    })
}
export function searchGoods(obj) {
    return server({
        method: "GET",
        url: "api/manage/product/search",
        params: {...obj}
    })
}
export function goodsAdd(obj) {
    return server({
        method: "POST",
        url: "api/manage/product/add",
        data: obj
    })
}
export function goodsUpdate(obj) {
    return server({
        method: "POST",
        url: "api/manage/product/update",
        data: obj
    })
}
export function getOrderList(obj) {
    return server({
        method: "GET",
        url: `api/manage/order/list`,
        params: {...obj}
    })
}
export function searchOrder(obj) {
    return server({
        method: "GET",
        url: "api/manage/order/search",
        params: {...obj}
    })
}
export function getOrderInfo(obj) {
    return server({
        method: "GET",
        url: `api/manage/order/info`,
        params: {...obj}
    })
}