import Vue from 'vue';
import Vuex from 'vuex';
import router from './router'



import {
  defaultClient as apolloClient
} from './main';
import {
  GET_POSTS,
  SIGNIN_USER,
  GET_CURRENT_USER
} from './queries';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    }
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);
      apolloClient.query({
        query: GET_CURRENT_USER
      })
      .then(({ data }) => {
        commit('setLoading', false);
        console.log(data.getCurrentUser);
      })
      .catch(err => {
      commit('setLoading', false);        
        console.log(err);
      });
    },
    getPosts: ({
      commit
    }) => {
      commit('setLoading', true);
      // 使用应用找到 getPosts 查询
      apolloClient
        .query({
          query: GET_POSTS
        }).then(({
          data
        }) => {
          commit('setPosts', data.getPosts);
          commit('setLoading', false);
        })
        .catch(err => {
          commit('setLoading', false)
          console.error(err);
        });
    },
    signinUser: ({ commit }, payload) => {
      apolloClient
        .mutate({ 
          mutation: SIGNIN_USER,
          variables: payload
         })
          .then(({ data }) => {
            localStorage.setItem('token', data.signinUser.token);

            router.go();
          })
          .catch(err => {
            console.error(err);
          });
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading
  }
});
