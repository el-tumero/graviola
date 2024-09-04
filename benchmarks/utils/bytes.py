def int_to_bytes(x: int) -> bytes:
    return x.to_bytes((x.bit_length() + 7) // 8, "big")


def int_from_bytes(bytes: bytes) -> int:
    return int.from_bytes(bytes, "big")
