GUI_DEFAULT_POS = new _vector(0,0)
GUI_PADDING = new _vector(5,5)
GUI_FONT_SZ = 12
GUI_FONT = 'sans-serif'
GUI_COLOR = "white"

class GUI_Notif
{
    constructor(pos=GUI_DEFAULT_POS, text="")
    {
        this.position = pos
        this.dimensions = new _vector(
            ctx.measureText(text).width+(2*GUI_PADDING.x),
            GUI_FONT_SZ+(2*GUI_PADDING.y)
        )
        this.text = text
    }
    draw()
    {
        ctx.setColor("black")
        ctx.fillRect(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y)
        ctx.setColor(GUI_COLOR)
        ctx.strokeRect(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y)
        ctx.fillText(this.text, this.position.x+GUI_PADDING.x, this.position.y+GUI_FONT_SZ+GUI_PADDING.y)
    }
}