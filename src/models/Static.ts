// Description: Static data for the application.

/**
 * Enum for user roles.
 * @readonly
 * @enum {number}
 */
const Role = {
	SUPER_ADMIN: 0,
	ADMIN: 1,
	PREMIUM_MEMBER: 2,
	MEMBER: 3,
}

/**
 * Mapping of role IDs to their text representations.
 * @type {{ [key: number]: string }}
 */
const RoleIDToText: { [n: number]: string } = {
	0: 'Super Admin',
	1: 'Admin',
	2: 'Premium Member',
	3: 'Member',
}

/**
 * Coefficients for quest experience rewards.
 * @type {{ [key: string]: number }}
 */
const QuestExpRewardCoefficient: { [key: string]: number } = {
	REWARD_INTRO: 0.5,
	REWARD_NORMAL: 1,
	REWARD_HIGH: 1.5,
	REWARD_VERY_HIGH: 2,
	REWARD_EXTREME: 2.5,
	REWARD_LEGENDARY: 3,
}

/**
 * Mapping of levels to the experience required to reach them.
 * @type {{ [n: number]: number }}
 */
const ExpLevelMapping: { [n: number]: number } = {
	1: 10,
}

/**
 * Mapping of levels to the total experience required to reach them.
 * @type {{ [n: number]: number }}
 */
const ExpTotalMapping: { [n: number]: number } = {
	1: 10,
}

// Each level needs 1.3 times the experience compared to the previous level.
// ExpLevelMapping contains the experience value needed for each level.
// ExpTotalMapping contains the total experience value needed to reach a certain level.
// Calculate the experience value needed for each level up to level 100.
for (let i = 2; i <= 100; i++) {
	ExpLevelMapping[i] = Math.ceil(ExpLevelMapping[i - 1] * 1.3)
	ExpTotalMapping[i] = ExpTotalMapping[i - 1] + ExpLevelMapping[i]
}

export {
	Role,
	RoleIDToText,
	ExpLevelMapping,
	ExpTotalMapping,
	QuestExpRewardCoefficient,
}
