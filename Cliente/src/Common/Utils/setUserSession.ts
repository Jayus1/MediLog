import { create } from 'zustand'
import axios from 'axios';
import getBackendConnectionString from './getBackendString';

//State Management que se encarga del Inicio de Session de un usuario
//La Instancia del Usuario se almacena en el LocalStorage y se elimina cuando se cierra la session

const useUserStore = create((set: any, get: any) => ({
    user: {},
    casos: [],
    cirugias: [],
    consultas: [],
    transacciones: [],
    pacientes: [],
    paciente: [],
    authUser: (user: any) => set(() => {
        localStorage.setItem('user', JSON.stringify(user));
        return { user: user }
    }),
    getPacientes: (id: number) => {
        const query = JSON.parse(localStorage.getItem('user') || '{}');
        set({ pacientes: [] })
        if (query.tipo === "Paciente") {
            axios.get(getBackendConnectionString(`pacientes/${id}`)).then((response) => {
                const data = response.data;
                if (response.status === 200 || response.status === 201) {
                    set({ casos: data.casos, cirugias: data.cirugias, consultas: data.consultas, transacciones: data.transacciones })
                    console.log(data);
                    return data;
                }
                return null;
            }).catch(error => {
                console.log(error);
            })
            return
        }
        axios.get(getBackendConnectionString(`pacientes/${id}`)).then((response) => {
            const data = response.data;
            console.log([data]);
            if (response.status === 200 || response.status === 201) {
                set({ paciente: [data] })
                return;
            }
            return null;
        }).catch(error => {
            console.log(error);
        })
        return
    },
    autopopulate: async () => {
        const query = JSON.parse(localStorage.getItem('user') || '{}');
        const id = query.id;
        if (query.tipo === "Paciente") {
            const result = await axios.get(getBackendConnectionString(`usuarios/${id}`)).then((response) => {
                const data = response.data;
                if (response.status === 200 || response.status === 201) {
                    return data;
                }
                return null;
            }).catch(error => {
                console.log(error);
            })

            set({ casos: result.casos, cirugias: result.cirugias, consultas: result.consultas, transacciones: result.transacciones })
            return result;
        }
        const result = await axios.get(getBackendConnectionString(`usuarios/${id}`)).then((response) => {
            const data = response.data;
            if (response.status === 200 || response.status === 201) {
                return data;
            }
            return null;
        }).catch(error => {
            console.log(error);
        })
        set({ casos: result.casos, cirugias: result.cirugias, consultas: result.consultas, transacciones: result.transacciones, pacientes: result.pacientes })
        return result;
    },
    authenticated: () => {
        const query = JSON.parse(localStorage.getItem('user') || '{}');
        const user = Object.keys(query);
        if (user.length !== 0) {
            return true;
        }
        return false;
    },
    updateUser: (product: any) => set(() => {
        const query = JSON.parse(localStorage.getItem('user') || '{}');
        query.plan = product;
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(query));
        return { user: query }

    }),
    getUser: () => {
        const query = JSON.parse(localStorage.getItem('user') || '{}');
        const user = query;
        return user;
    },

    getUserData: async (id: number, dataType: string) => {
        const query = JSON.parse(localStorage.getItem('user') || '{}');
        if (query.tipo === "Paciente") {
            const result = await axios.get(getBackendConnectionString(`usuarios/${id}`)).then((response) => {
                const data = response.data;
                if (response.status === 200 || response.status === 201) {
                    return data;
                }
                return null;
            }).catch(error => {
                console.log(error);
            })
            return result;
        }
        const result = await axios.get(getBackendConnectionString(`usuarios/${id}`)).then((response) => {
            const data = response.data;
            if (response.status === 200 || response.status === 201) {
                return data;
            }
            return null;
        }).catch(error => {
            console.log(error);
        })
        console.log(result);

        return result;
    },

    logoutUser: () => set(() => {
        localStorage.removeItem('user');
        return { user: null }
    })
}));

export default useUserStore;