class Levelling {
  /**
   * @param {Number} level Calculate the total XP needed by the user for Level X.
   */
  getTotalXPForLevel (level) {
    let totalXP = 0
    for (let i = 1; i <= level; i++) {
      totalXP += this.calculateLevelXP(i)
    }
    return totalXP
  }

  /**
   * @param {Number} level Calculate the XP needed to go Level X to Level Y.
   */
  calculateLevelXP (level) {
    const offset = 32.5
    const power = 2.75
    const scale = 15
    return Math.ceil(((level + offset) ** power) / scale)
  }

  /**
   * @param {Number} totalXp Calculate the level based on XP of the user.
   */
  calculateLevel (totalXp) {
    let level = 1
    for (level; totalXp > this.calculateLevelXP(level); level++) {
      totalXp -= this.calculateLevelXP(level)
    }
    return level
  }

  /**
   * @param {Number} totalXp Calculate the amount of XP the user needs to level up.
   */
  calculateNeededXP (totalXp) {
    const currentLevel = this.calculateLevel(totalXp)
    const levelXP = this.getTotalXPForLevel(currentLevel)
    return levelXP - totalXp
  }

  /**
   * @param {Number} totalXp Calculate the current XP the user has towards their current level.
   */
  calculateCurrentXP (totalXp) {
    for (let level = 1; totalXp > this.calculateLevelXP(level); level++) {
      totalXp -= this.calculateLevelXP(level)
    }
    return totalXp
  }

  /**
   * @param {*} min The minimum amount of XP to give.
   * @param {*} max The maximum amount of XP to give.
   * @param {*} multiplier The multiplier which you would like to apply to the XP.
   */
  calculateXPtoGive (min, max, multiplier = 1) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}

module.exports = new Levelling()
