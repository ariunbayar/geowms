from io import BytesIO
import base64
import PIL


def resize_b64_to_sizes(src_b64, sizes):

    src_bytes = base64.b64decode(src_b64)
    src_io = BytesIO(src_bytes)

    def _resize(image, size):
        dst = BytesIO()
        image.thumbnail(size)
        image.save(dst, format='PNG')
        return dst

    image = PIL.Image.open(src_io)

    return map(lambda size: _resize(image, size).getvalue(), sizes)
