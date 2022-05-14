function lerp(A, B, t)
{
    return A+(B-A) * t;
}
function getIntersection(A, B, C, D)
{
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bttm = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if(bttm != 0)
    {
        const t = tTop/bttm;
        const u = uTop/bttm;
        if(t >= 0 && t <= 1 && u >= 0 && u <= 1)
        {
            return{
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t}
        }
    }

    return null;
}

function polysIntersect(p1, p2)
{
    for(let i = 0; i < p1.length; i++)
    {
        for(let j = 0; j < p2.length; j++)
        {
            const touch = getIntersection(
                p1[i],
                p1[(i + 1) % p1.length],
                p2[j],
                p2[(j + 1) % p2.length]
            );
            if(touch)
            {
                return true;
            }
        }
    }

    return false;
}

function getRGBA(value)
{
    const A = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;
    return "rgba(" + R + "," + G + "," + B + "," + A + ")";
}