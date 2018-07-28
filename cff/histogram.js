function Histogram() {
    function fileDatum(datum, filed_data) {
        if (filed_data.length === 0) {
            filed_data.push(datum);
            return filed_data;
        }

        for (var i = 0; i < filed_data.length; i++) {
            if (Levenshtein.evaluate(datum.label, filed_data[i].label)) {
                filed_data[i].count = datum.count + filed_data[i].count;
                if (datum.label.length < filed_data[i].label.length) filed_data[i].label = datum.label;
                return filed_data;
            }
        }

        filed_data.push(datum);
        return filed_data;
    }

    function countData(data, iteration) {
        var ITERATION_DISMISSAL_THRESHOLD = 3;
        var filed_data = [];
        for (var i = 0; i < data.length; i++) {
            if (iteration < ITERATION_DISMISSAL_THRESHOLD || data[i].count > 1)
                filed_data = fileDatum(data[i], filed_data);
        }
        return filed_data;
    }

    function initialFormating(chunk) {
        return chunk.reduce(function (result, item, index) {
            result[index] = {label: item, count: 1};
            return result;
        }, []);
    }

    function chunkArray(data, chunk_size, init) {
        var chunks = [];
        for (var i = 0; i < data.length; i += chunk_size) {
            var chunk = data.slice(i, i + chunk_size);
            if (init) chunk = initialFormating(chunk);
            chunks.push(chunk);
        }
        return chunks;
    }

    function drawHistogram(data, canvas) {
        var WIDTH = 1500;
        var HEIGHT = 600;
        var GRID_SIZE = 20;
        var PADDING = 20;
        var NUMBER_OF_DISPLAYED_ELEMENTS = 15;

        canvas.setAttribute("width", WIDTH);
        canvas.setAttribute('height', HEIGHT);

        var context = canvas.getContext("2d");

        var grid = (WIDTH / GRID_SIZE);

        for (var i = 0; i < grid; i++) {
            context.moveTo(WIDTH, GRID_SIZE * i);
            context.lineTo(0, GRID_SIZE * i);
        }
        context.strokeStyle = "lightgray";
        context.stroke();

        var max_count = data[0].count;
        var scale = (HEIGHT - (2 * PADDING)) / max_count;
        var graph_width = (WIDTH - PADDING) / NUMBER_OF_DISPLAYED_ELEMENTS;

        for (var i = 0; i < NUMBER_OF_DISPLAYED_ELEMENTS; i++) {
            context.fillStyle = "lightblue";
            var x = graph_width + ((i - 1) * graph_width) + PADDING;
            var y = (HEIGHT - (scale * data[i].count));
            var w = graph_width - PADDING;
            var h = (data[i].count * scale);
            context.fillRect(x, y, w, h);
            context.fillStyle = "black";
            context.font = "15px Arial";
            context.save();
            context.translate(x, HEIGHT / 2);
            context.rotate(-Math.PI / 2);
            context.textAlign = "center";
            context.fillText(data[i].label, 0, 0);
            context.restore();
            context.fillText(data[i].count, x + graph_width / 2 - PADDING, HEIGHT - 10, graph_width);
        }

    }

    function printAllResults(data, table) {
        for (var i = 0; i < data.length; i++) {
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            td.innerText = data[i].label + " (" + data[i].count + ")";
            tr.appendChild(td);
            table.appendChild(tr);
        }
    }

    this.createHistogram = function(data, display_histogram, canvas, table) {
        var CHUNK_SIZE = 500;
        var chunks = chunkArray(data, CHUNK_SIZE, true);

        var iteration = 0;
        var working = true;
        while (working) {
            if (chunks.length === 1) working = false;
            iteration++;
            var filtered_chunks = [];
            for (var i = 0; i < chunks.length; i++) {
                filtered_chunks.push(countData(chunks[i], iteration));
            }
            var temp = [];
            for (var i = 0; i < filtered_chunks.length; i++) {
                temp = temp.concat(filtered_chunks[i]);
            }
            chunks = chunkArray(temp, CHUNK_SIZE * iteration, false);
        }

        var histogram_data = chunks[0].sort(function (a, b) {
            var count_a = a.count;
            var count_b = b.count;
            return (count_a > count_b) ? -1 : (count_a < count_b) ? 1 : 0;
        });
        //console.log(histogram_data);

        drawHistogram(histogram_data, canvas);
        printAllResults(histogram_data, table);
        display_histogram.style.display = "block";
    }
}