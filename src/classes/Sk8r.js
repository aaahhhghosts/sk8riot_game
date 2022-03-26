import Sprite from '../Sprite.js';
import { sk8r_floor, player_names } from '../constants.js';

export default class Sk8r extends Sprite {

  static src = player_names.map(name => `/sprites/players/${name}.png`);

  constructor(x, y, context, images, img_num) {
      super({
          context: context,
          image: images[img_num],
          x: x,
          y: y,
          width: 27,
          height: 41,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 6,
          frames: 6,
          loop_animation: true,
          hasGravity: true
      });

      this.name = player_names[img_num];
      this.images = images;
      this.img_num = img_num;

      this.isDucking = false;
      this.isGrounded = true;
      this.played_gameover_sfx = false;
      this.gravity = 0.3;
      this.velocity_y = 0;
      this.velocity_x = 0;
      this.set_scroll(false, 0);

      this.isAlive = true;
      this.death_floor = sk8r_floor;
      this.cause_of_death = "unknown";
      this.isFalling = false;
      this.timeSinceJump = 0;
  }

  next_sprite() {
      if (this.img_num < this.images.length-1) {
          this.img_num += 1;
      } else {
          this.img_num = 0;
      }
      this.name = player_names[this.img_num];
      this.image = this.images[this.img_num];
  }

  prev_sprite() {
      if (this.img_num > 0) {
          this.img_num -= 1;
      } else {
          this.img_num = this.images.length-1;
      }
      this.name = player_names[this.img_num];
      this.image = this.images[this.img_num];
  }

  get_floor() {return this.floor;}
  set_floor(floor) {this.floor = floor;}
  getName() {return this.name;}
  setName(name) {this.name = name;}

  get_autopsy() {return (this.name + " was killed by " + this.cause_of_death + "!").substring(0, 34);}

  animate_ride() {
      this.row = 0;
      this.frames = 6;
      this.frameIndex = 0;
      this.startingFrame = 0;
  }

  animate_duck() {

      this.frameIndex = 0;
      this.row = 1;
      this.frames = 7;
      this.startingFrame = 1;
  }

  animate_duck_midair() {

      // Freeze frame while in air.
      this.row = 1;
      this.frameIndex = 2;
      this.frames = 1;
  }

  doing_duck_animation() {return this.row == 1;}

  animate_jump() {
      this.row = 2;
      this.frames = 2;
      this.frameIndex = 0;
      this.startingFrame = 0;
  }

  animate_death() {
      this.width = 36;
      this.row = 3;
      this.frames = 4;
      this.frameIndex = 0;
      this.startingFrame = 0;
      this.ticksPerFrame = 12;
      this.loop_animation = false;
  }

  duck() {
      this.isDucking = true;
      this.animate_duck();
  }

  duck_midair() {
      this.isDucking = true;
      this.animate_duck_midair();
  }

  jump() {
      this.isGrounded = false;
      if (!this.isDucking) {
          this.animate_jump();
          this.y += 3;
      } else {
          this.animate_duck_midair();
          this.y += 2;
      }
      this.velocity_y = 4;
  }

  stand() {
      this.isDucking = false;
      this.animate_ride();
  }

  kill(cause) {
      this.isAlive = false;
      this.isDucking = false;
      this.cause_of_death = cause;
      this.animate_death();
      this.throw_off_board();
  }

  throw_off_board() {

      // Send sk8r's body flying.
      this.death_floor = this.floor;
      this.set_floor(sk8r_floor-13);
      this.isGrounded = false;
      this.velocity_y = 4;
      this.y += 3;
      this.velocity_x = 1.5;
  }

  update_sk8r(crates, cars, player_hit_sfx, gameover_sfx) {
      super.update();

      // Update current floor as long as player is alive.
      if (this.isAlive) {
          this.update_floor(crates, cars, player_hit_sfx);

      // Else if player is dead, move into various death logic.
      } else {

          // If sk8r is dead, move body forwards.
          if (this.velocity_x > 0) {

              this.x += this.velocity_x;
              if (this.isGrounded) {
                  this.velocity_x -= this.velocity_x / 30;

                  if (this.velocity_x < 0.1) {
                      this.velocity_x = 0;
                  }
              }
          }

          // If dead and landed on the ground, play death sfx if it hasn't be played yet.
          if (this.isGrounded && !this.played_gameover_sfx) {
              gameover_sfx.play();
              this.played_gameover_sfx = true;
          }

          // Update player if needed, because for some reason the player's floor
          // WILL NOT UPDATE and the body will float off screen.
          if (this.floor > sk8r_floor-13) {
              this.set_floor(sk8r_floor-13);
          }
      }
  }

  apply_gravity() {

      if ((this.y > this.floor-2 && this.y > sk8r_floor) || !this.isAlive) {

          // Calculate the current moment in the arch of motion.
          this.timeSinceJump += 1;
          let now = this.timeSinceJump;

          // Get the next change in y value, be it up or down, and add it to the current y.
          let next_delta_y = ((this.velocity_y * now)- (this.gravity * (Math.pow(now, 2) / 2))) / 10
          this.y += next_delta_y;

          // If delta y is positive, then we are moving up in the arch of motion.
          // If it is negative, we are falling down. Give boolean a bias to lean true.
          this.isFalling = (next_delta_y > 0.5);

          // Fall faster if ducking.
          if (this.isDucking) {
              this.y -= (1.1 * (1+now/25));
          }

          // If sk8r is alive, return to skating animation on landing.
          if (this.y < this.floor && !this.isGrounded) {

              this.isGrounded = true;

              if (this.isAlive) {

                  // If player didn't press the duck button while mid-air, return to ride.
                  if (!this.isDucking) {
                      this.animate_ride();

                  // Else, duck on landing. If already ducking, end animation freeze on frame 1.
                  } else {
                      this.duck();
                  }
              }
          }

          if (this.y <= this.floor) {
              this.y = this.floor;

              this.isFalling = false;
              this.timeSinceJump = 0;
              this.velocity_y = 0;
          }
      }
  }

  update_floor(crates, cars, player_hit_sfx) {

      // Reset floor.
      this.set_floor(sk8r_floor);

      // Loop through all creates.
      crates.filter(crate => !crate.isBroken).some((crate, j) => {

          // If crate is at the same place as sk8r
          if (this.x >= crate.x-crate.width*2 && this.x <= crate.x+crate.width/2) {

              // Get y coord of the top of this crate.
              let top_of_crate = crate.y+(crate.height-1);

              // If sk8r is below the top of crate, they have hit a wall.
              // Kill sk8r and break out of loop.
              if (this.y < top_of_crate-2 && this.x-3 >= crate.x-crate.width*2) {

                  this.kill(crate.getTypeName());
                  player_hit_sfx.play();
                  return true;
              }

              // Else if sk8r clears the top of crate, update the current floor.
              if (this.get_floor() < top_of_crate) {
                  this.set_floor(top_of_crate);
              }
          }
      });


      // Loop through all cars.
      cars.filter(car => !car.isBroken).some((car, j) => {

          // If car is at the same place as sk8r
          if (this.x >= car.x-23 && this.x <= car.x+car.width-7) {

              // Get y coord of the top of this car.
              let top_of_car = car.y+car.height/2-1;

              if (this.x >= car.x+5 && this.x <= car.x+56) {
                  top_of_car = car.y+(car.height-4);
              }

              // If sk8r is below the top of car, they have hit a wall.
              // Kill sk8r and break out of loop.
              if (this.y < top_of_car-2) {
                  this.kill(car.getTypeName());
                  player_hit_sfx.play();
                  return true;
              }

              // Else if sk8r clears the top of car, update the current floor.
              if (this.get_floor() < top_of_car) {
                  this.set_floor(top_of_car);
              }
          }
      });
  }

  reset_sk8r() {
      super.reset();

      this.isAlive = true;
      this.played_gameover_sfx = false;
      this.isGrounded = true;
      this.isDucking = false;
      this.velocity_y = 0;
      this.velocity_x = 0;
      this.isFalling = false;
      this.timeSinceJump = 0;
  }
}
