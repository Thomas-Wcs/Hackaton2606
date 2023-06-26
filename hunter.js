var config = {
  type: Phaser.AUTO,
  width: 1500,
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var player;
var creatures;
var bullets;
var poops;
var cursors;
var spaceKey;
var lastFired = 0;
var nextPoopTime = 0;
var score = 0;
var scoreText;
var lives = 3;
var livesText;
var health = 100;
var healthText;
var peta;
var petaCount = 0;

var game = new Phaser.Game(config);

game.events.on('error', function (error) {
  console.error(error);
});

function preload() {
  this.load.image('hunter', 'hunterAssets/hunter.jpg');
  this.load.image('creature', 'hunterAssets/sanglier.jpg');
  this.load.image('bullet', 'hunterAssets/bullet.jpg');
  this.load.image('poop', 'hunterAssets/poop.jpg');
  this.load.image('peta', 'hunterAssets/peta.jpg');
}

function create() {
  player = this.physics.add.sprite(500, 650, 'hunter');
  player.setImmovable(true);
  player.setScale(1 / 4.6);

  creatures = this.physics.add.group();
  cursors = this.input.keyboard.createCursorKeys();
  spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  bullets = this.physics.add.group({
    classType: Bullet,
    maxSize: 10,
    runChildUpdate: true,
  });

  poops = this.physics.add.group();

  this.physics.add.collider(bullets, creatures, hitCreature, null, this);
  this.physics.add.collider(player, creatures, hitPlayer, null, this);
  this.physics.add.collider(player, poops, hitPoop, null, this);

  scoreText = this.add.text(16, 16, 'score: 0', {
    fontSize: '32px',
    fill: '#000',
  });
  livesText = this.add.text(16, 56, 'lives: 3', {
    fontSize: '32px',
    fill: '#000',
  });
  healthText = this.add.text(16, 96, 'health: 100', {
    fontSize: '32px',
    fill: '#000',
  });

  this.time.addEvent({
    delay: 3000,
    callback: function () {
      let creature = creatures.create(
        Phaser.Math.Between(50, 1450),
        0,
        'creature'
      );
      creature.setScale(0.25);
      creature.setVelocityY(Phaser.Math.Between(50, 100));
    },
    callbackScope: this,
    loop: true,
  });
}

function update(time) {
  if (cursors.left.isDown) {
    player.setVelocityX(-400);
  } else if (cursors.right.isDown) {
    player.setVelocityX(400);
  } else {
    player.setVelocityX(0);
  }

  if (spaceKey.isDown && time > lastFired) {
    var bullet = bullets.get();
    if (bullet) {
      bullet.fire(player.x, player.y);
      lastFired = time + 500;
    }
  }

  if (time > nextPoopTime) {
    let creature = Phaser.Utils.Array.GetRandom(creatures.getChildren());
    if (creature) {
      let newPoop = poops.create(creature.x, creature.y, 'poop');
      newPoop.setScale(0.1);
      newPoop.setVelocityY(100);
      nextPoopTime = time + 12000;
    }
  }

  if (petaCount % 3 === 0 && petaCount > 0 && !peta) {
    createPeta();
  }
}

function hitCreature(bullet, creature) {
  bullet.setActive(false);
  bullet.setVisible(false);
  creature.disableBody(true, true);
  score += 10;
  scoreText.setText('Score: ' + score);
  petaCount++;
}

function hitPlayer(player, creature) {
  creature.disableBody(true, true);
  lives -= 1;
  livesText.setText('Lives: ' + lives);
}

function hitPoop(player, poop) {
  poop.disableBody(true, true);
  health -= 10;
  healthText.setText('Health: ' + health);
  if (health <= 0) {
    health = 100;
    healthText.setText('Health: ' + health);
    lives -= 1;
    livesText.setText('Lives: ' + lives);
  }
}

function createPeta() {
  peta = creatures.create(
    Phaser.Math.Between(50, 1150),
    Phaser.Math.Between(-300, -100),
    'peta'
  );
  peta.setScale(0.5).setGravityY(100); // Adjust the gravity to slow down PETA's descent
  peta.setImmovable(true);
}

var Bullet = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,
  initialize: function Bullet(scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
    this.speed = Phaser.Math.GetSpeed(400, 1);
  },
  fire: function (x, y) {
    this.setPosition(x, y - 50);
    this.setActive(true);
    this.setVisible(true);
    this.setScale(0.1);
  },
  update: function (time, delta) {
    this.y -= this.speed * delta;

    if (this.y < -50) {
      this.setActive(false);
      this.setVisible(false);
    }
  },
});
