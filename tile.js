function rvrse(b) {
    let arr = b.split('');
    arr = arr.reverse();
    arr = arr.join('');
    return arr;
}

function compairEdges(a,b) {
    return a == rvrse(b);
}

class Tile {
    constructor(img, edges, r) {
        this.img = img;
        this.edges = edges;

        this.up = [];
        this.right = [];
        this.down = [];
        this.left = [];
        this.r = r;
    }


    analyze(tiles) {
        for(let i =0;i<tiles.length;i++) {
            const tile = tiles[i];
            //* connections for up
            if(compairEdges(tile.edges[2], this.edges[0])) {
                this.up.push(i);
            }

            //* connections for right
            if(compairEdges(tile.edges[3], this.edges[1])) {
                this.right.push(i);
            }

            //* connections for down
            if(compairEdges(tile.edges[0], this.edges[2])) {
                this.down.push(i);
            }

            //* connections for left
            if(compairEdges(tile.edges[1], this.edges[3])) {
                this.left.push(i);
            }
        }
    }


    rotate(num) {
        const w = this.img.width;
        const h = this.img.height;


        const newImg = createGraphics(w, h);
        newImg.imageMode(CENTER);
        newImg.translate(w/2,h/2);
        newImg.rotate(HALF_PI * num);
        newImg.image(this.img, 0, 0);

        const newEdges = [];
        let len = this.edges.length;
        for (let i=0;i<len;i++) {
            newEdges[i] = this.edges[(i - num + len) % len];
        }

        return new Tile(newImg, newEdges);
    }
}