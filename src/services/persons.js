import axios from 'axios'

const baseUrl =
  'https://contacts-api-backend-production.up.railway.app/api/persons'

export const getAllPersons = () => {
  return axios.get(baseUrl).then((response) => {
    const { data } = response
    return data
  })
}

export const createPerson = ({ id, name, number }) => {
  return axios.post(baseUrl, { id, name, number }).then((response) => {
    const { data } = response
    return data
  })
}

export const updatePerson = ({ id, name, number }) => {
  return axios
    .put(`${baseUrl}/${id}`, { id, name, number })
    .then((response) => {
      const { data } = response
      return data
    })
}

export const deletePerson = ({ id }) => {
  return axios.delete(`${baseUrl}/${id}`).then((response) => {
    const { data } = response
    return data
  })
}
