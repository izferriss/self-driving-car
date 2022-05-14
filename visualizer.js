class Visualizer
{
    static drawNetwork(ctx, network)
    {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;

        const levelHeight = height/network.levels.length;

        for(let i = network.levels.length - 1; i >= 0; i--)
        {
            const levelTop = top + lerp(height - levelHeight, 0, network.levels.length == 1 ? 0.5 : i/(network.levels.length - 1));

            Visualizer.drawLevel(ctx, network.levels[i], left, levelTop, width, levelHeight, i == network.levels.length - 1 ? ['U','L','R','D'] : []);
        }
    }

    static drawLevel(ctx, level, left, top, w, h, labels)
    {
        const right = left + w;
        const bottom = top + h;

        const {inputs, outputs, weights, biases} = level;

        const nodeRadius = 20;

        //connectors
        for(let i = 0; i < inputs.length; i++)
        {
            for(let j = 0; j < outputs.length; j++)
            {
                ctx.beginPath();
                ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
                ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);
                ctx.lineWidth = 2;
                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        //input nodes
        for(let i = 0; i < inputs.length; i++)
        {
            const x = Visualizer.#getNodeX(inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * .6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
            ctx.closePath();
        }

        //output nodes
        for(let i = 0; i < outputs.length; i++)
        {
            const x = Visualizer.#getNodeX(outputs, i, left, right);

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * .6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, nodeRadius * .8, 0 , Math.PI * 2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3,3]);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.closePath();

            if(labels[i])
            {
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "white";
                ctx.font=(nodeRadius * .75) + "px Arial";
                ctx.fillText(labels[i], x, top + nodeRadius * .1);
                ctx.lineWidth = 0.25;
                ctx.strokeText(labels[i], x, top+ nodeRadius * .1);
            }
        }


    }

    static #getNodeX(nodes, index, left, right)
    {
        return lerp(left, right, nodes.length == 1 ? 0.5 : index/(nodes.length - 1));
    }
}