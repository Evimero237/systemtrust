$(document).ready(function () {
    DropifyScript();
});

$("#listProduct").click(async (e) => {
    e.preventDefault();
    let name = $("#name").val();
    let price = $("#price").val();
    let properties = $("#prop").val();
    let description = $("#description").val();
    let categoryId = $("#category").val();
    let image = $("#imageUpload").val();
    let file_check = $("#fileUpload").val();
    if (!name || !price || !prop || !categoryId || !description)
        return swal.fire("", "Kindly fill all inputs in first page.", "error", "btn btn-secondary");
    if (!image)
        return swal.fire("", "product Image required", "error", "btn btn-secondary");
   
    let base64_image = $("#imageUpload").closest(".dropify-wrapper").find('img').attr('src');
    let base64_file = $("#fileUpload").closest(".dropify-wrapper").find('img').attr('src');
    let images = [base64_image];
    let file = base64_file;
    let data = { name, categoryId, description, file, price, properties, images };
    $.ajax({
        url: "https://systemtrustng.herokuapp.com/add-product", type: 'POST', data,
        success: function (response) {
            if (response.error === 200) {
                swal.fire("", response.message, "success", "btn btn-secondary").then(function () { window.location.reload() });
                // let pollId = response.data.pollId;
                // $.ajax({
                //     url: "/create-product-image/" + pollId, method: 'POST', data, contentType: false, processData: false,
                //     success: function (response) {
                //         if (response.error === 200) {
                //             swal.fire("", response.message, "success", "btn btn-secondary").then(function () { window.location.reload() });
                //         } else swal.fire("", response.message, "error", "btn btn-secondary");
                //     },
                //     error: function (error) {
                //         swal.fire("", error.message, "error", "btn btn-secondary");
                //     }
                // });
            } else {
                swal.fire("", response.message, "error", "btn btn-secondary");
            }
        },
        error: function (error) {
            swal.fire("", error.message, "error", "btn btn-secondary");
        }
    });
});

async function handleImageUpload(imageFile) {
    let types = ['image/png', 'image/jpeg', 'image/gif'];
    if (types.every(type => imageFile.type !== type))
        return swal.fire("", imageFile.type + ' is not a supported format\n', "error", "btn btn-secondary");

    let size = 2000000;
    if (imageFile.size > size)
        return swal.fire("", imageFile.size + ' is too large, please pick a smaller file', "error", "btn btn-secondary");

    const options = {
        maxSizeMB: 20,
        maxWidthOrHeight: 1920,
        useWebWorker: false
    }
    try {
        const compressedFile = await imageCompression(imageFile, options);
        return (compressedFile); // write your own logic
    } catch (error) {
        return swal.fire("Image upload Error", error.message, "error", "btn btn-secondary");
    }
}

function DropifyScript() {
    $('.dropify').dropify({
        messages: {
            'default': 'Drag and drop a file here or click to select',
            'replace': 'Drag and drop or click to replace file',
            'remove': 'Remove file',
            'error': ', something wrong was appended.'
        },
        error: {
            'fileSize': 'The file size is too big,please choose a file not bigger than 2MB.'
        }
    });
}