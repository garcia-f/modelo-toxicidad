const threshold = 0.7;

        const analisis = document.getElementById('analyze-button');
        const tableBody = document.querySelector('#table-wrapper tbody');

        analisis.addEventListener('click', async () => {
            const sentences = document.getElementById('input-text').value;

            const model = await toxicity.load(threshold);

            model.classify(sentences).then(predictions => {
                console.log(JSON.stringify(predictions, null, 2));

                const storedData = localStorage.getItem('toxicityData');
                const storedPredictions = 
                storedData ? JSON.parse(storedData).predictions : [];
                storedPredictions.push({ text: sentences, predictions: predictions });
                localStorage.setItem('toxicityData', JSON.stringify({ predictions: storedPredictions }));

                document.getElementById('input-text').value = '';
                updateTable();
            })
        });

        function updateTable() {
            tableBody.innerHTML = '';
            const storedData = localStorage.getItem('toxicityData');

            if (storedData) {
                const storedPredictions = JSON.parse(storedData).predictions;

                if (Array.isArray(storedPredictions)) {
                    storedPredictions.forEach(predictionSet => {
                        const { text, predictions } = predictionSet;
                        const tableRow = document.createElement('tr');
                        const tableText = document.createElement('td');
                        const tableResults = document.createElement('td');

                        tableText.textContent = text;

                        tableRow.appendChild(tableText);

                        if (Array.isArray(predictions)) {
                            predictions.forEach(prediction => {
                                const result = prediction.results[0];
                                const tableData = document.createElement('td');
                                tableData.textContent = result.match;
                                tableRow.appendChild(tableData);
                            });
                        }
                        tableBody.appendChild(tableRow);
                    });
                }
            }
        }
        updateTable();
        