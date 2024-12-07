/* Auxiliary function to open a file selection dialog */
export function selectFile() {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.addEventListener('change', (e) => {
      resolve(e.target.files[0]);
    }, false);
    input.click();
  });
}

/* Auxiliary function to read data from a file */
export function readFile(file, readerFunc = "readAsText") {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      resolve(e.target.result);
    });
    reader[readerFunc](file);
  });
}


//readAsBinaryString
//readAsArrayBuffer
//readAsDataURL
export async function selectFileAndRead(readerFunc = "readAsText") {
  const file = await selectFile();
  const content = await readFile(file);
  return content
}


export const downloadFile = (file) => {
  const tempEl = document.createElement("a");
  document.body.appendChild(tempEl);
  const url = window.URL.createObjectURL(file);
  tempEl.href = url;
  tempEl.download = file.name;
  tempEl.click();
  window.URL.revokeObjectURL(url);
};


export const downloadText = (text, fileName = "new-file.txt") => {
  return downloadFile(new File([new Blob([text])], fileName, { type: 'text/plain' }))
};
