import Swal from 'sweetalert2'

export const showCustomAlert = (title, message, type) => {
  Swal.fire(title, message, type)
}

export const showProcessAlert = (message) => {
  Swal.fire({
    type: 'info',
    title: 'Processing!',
    text: message,
  })
}

export const showSuccessAlert = (message, transaction) => {
  Swal.fire({
    type: 'success',
    title: 'Success!',
    text: message,
    footer: '<small><a href="https://bloks.io/transaction/'+transaction+'" target="_blank">' + transaction + '</a></small>'
  })
}

export const showErrorAlert = (message) => {
  Swal.fire({
    type: 'error',
    title: 'Oops!',
    text: message,
  })
}