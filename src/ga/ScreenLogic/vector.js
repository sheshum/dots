class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    add(x, y) {
        this.x += x;
        this.y += y;
    }

    addVector(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }
}

module.exports = Vector2D;