import { CHANGEUSERINFO } from './mutation-types'

var app = {

    state: {
        userInfo: {
            username: ''
        }
    },
    mutations: {
        [CHANGEUSERINFO](state, userObj) {
            state.userInfo.username = userObj.username
        },
        
    },
    actions: {

    }
}

export default app