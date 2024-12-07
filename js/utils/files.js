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

//
//readAsBinaryString
//readAsArrayBuffer
//readAsDataURL
//
export async function selectFileAndRead(readerFunc = "readAsText") {
  const file = await selectFileToRead();
  const content = await readFile(file);
  return content
}
