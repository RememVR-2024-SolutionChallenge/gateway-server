import { ApiProperty } from '@nestjs/swagger';

class Scale {
  @ApiProperty()
  x: number;

  @ApiProperty()
  y: number;

  @ApiProperty()
  z: number;
}

class Position {
  @ApiProperty()
  x: number;

  @ApiProperty()
  y: number;

  @ApiProperty()
  z: number;
}

class Rotation {
  @ApiProperty()
  x: number;

  @ApiProperty()
  y: number;

  @ApiProperty()
  z: number;

  @ApiProperty()
  w: number;
}

export class ObjectDataType {
  @ApiProperty({ type: Scale })
  scale: Scale;

  @ApiProperty({ type: Position })
  position: Position;

  @ApiProperty({ type: Rotation })
  rotation: Rotation;
}
