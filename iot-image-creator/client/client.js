window.onload = async () => {
    const ctx = document.getElementById('sensorVisual').getContext('2d')
    
    let data = await fetch('https://localhost:3000/api/getSensorData')

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['0', '1', '2', '3', '4', '5'], // data.x
            datasets: [{
                label: 'sensor',
                data: [12, 19, 3, 5, 2, 3], // data.y
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

    const canvas = document.getElementById('sensorVisual')

    const dataUrl = await toPng(canvas, { cacheBust: true })

    const uploadApi = `https://api.cloudinary.com/v1_1/milecia/image/upload`

    const formData = new FormData()
    formData.append('file', dataUrl)
    formData.append('upload_preset', 'cwt1qiwn')

    await fetch(uploadApi, {
      method: 'POST',
      body: formData,
    })
}