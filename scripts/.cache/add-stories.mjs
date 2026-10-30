// Insert `story` plates into long episodes: each goes right before the scene that opens it.
// Idempotent: a story already present (same label) is skipped.
import { editStory } from './story-ops.mjs';

/** Episode title → [scene label the story opens on, story label, Korean, nth occurrence of that scene (default 1)]. */
const STORIES = {
	Seohyun: [
		['Surabol, the lane by the Gaya house', 'Manmyung', '만명'],
		['The Spring', 'Cavern', '동굴'],
		['Fifteen', 'Yushin', '유신']
	],
	Muryuk: [
		['The Golden Gaya palace', 'Prince of Golden Gaya', '금관가야의 왕자'],
		['Surabol · the years after', 'General of Silla', '신라의 장군']
	],
	Suro: [
		['The Sky and the Mountain', 'Ibiga', '이비가'],
		['Turtle Peak', 'Six Eggs', '여섯 알'],
		['The Red Sail', 'Queen Heo', '허황후']
	],
	'Huangdi (皇帝)': [
		['The Son of Heaven', 'Emperor', '황제'],
		['HALLWAY', 'Empress', '황후'],
		['The Yellow Sea', 'On Gunhae', '온군해']
	],
	'Yellow Mountain': [
		['Yellow Mountain Fields', 'The Field', '벌판'],
		['The First Clash', 'Four Clashes', '네 번의 격돌'],
		['Bangul & Gwanchang', 'Gwanchang', '관창']
	],
	Onjo: [
		['Buyeo', 'The First Son', '맏아들'],
		['The Road South', 'Four Rivers', '네 강'],
		['Mount Buak', 'Two Brothers', '두 형제']
	],
	'Prince Euija': [
		['The Sluice', 'The Prince', '왕자'],
		['The White River', 'The Boy in the River', '강물 속 소년'],
		['The Deer', 'The Crown', '왕관']
	],
	'Queen Sunduk': [
		['Munhee’s Room', 'The Lost Girl', '사라진 아이'],
		['Coronation Morning', 'Coronation', '즉위']
	],
	'Four Dragons': [
		['The Sickroom', 'The Envoys', '사신들'],
		['Five Hundred Li', 'The Expedition', '원정'],
		['Longmen Field', 'Xue Rengui', '설인귀']
	],
	Munhee: [
		['How They Met', 'Chunchu', '춘추'],
		['The Pyre', 'Marriage', '혼인']
	],
	'Gi (起)': [
		['The Harmony Council', 'The First Chair', '상대등'],
		['DAY 1', 'The Rising', '봉기']
	],
	'High Summit': [
		['Pyongyang · the High Summit', 'Pyongyang', '평양'],
		['The Chamber', 'Summit', '제가회의'],
		['Birth of Namseng', 'Son', '아들']
	],
	Sadaham: [
		['Surabol, the hwarang yard · 560', 'Hwarang', '화랑'],
		['The Battle of Great Gaya · 562', 'Great Gaya', '대가야'],
		['Surabol, the hwarang hall · winter, 563', 'Mugwan', '무관']
	],
	Gotaso: [
		['Two Springs Earlier', 'The Lantern Market', '연등 장터'],
		['The Gyuku Match', 'Spring', '봄']
	],
	Gumil: [
		['DAEYA FORTRESS', 'The Tally', '장부'],
		['Home', 'Maehwa', '매화']
	],
	Maehwa: [
		['The Banquet', 'Feast', '잔치'],
		['The Wall-Walk', 'The Night', '그날 밤'],
		['THE NEXT MORNING', 'The Drums', '북소리']
	],
	'Siege of Daeya': [
		['The North Road', 'The Siege', '포위'],
		['The Inner Room', 'The Fall', '함락'],
		['The Moon Palace', 'Chunchu', '춘추']
	],
	'Chunchu & Yeon': [
		['The West Gate', 'The Envoy', '사신'],
		['Surabol', 'Sixty Days', '예순 날']
	],
	'Sima Yi': [
		['Hwando · spring', 'The Young King', '젊은 왕'],
		['The Liao · summer', 'The Old Man', '노인'],
		['Liaodong · the rain stops', 'The Siege', '공성']
	],
	'Stallion Mountain': [
		['The West Line', 'The Mountain', '주필산'],
		['The Cell Under the Wall', 'Prisoners', '포로']
	],
	Ansi: [
		['Ansi · autumn 642', 'The Town', '고을'],
		['Ansi · that winter', 'The Red Seal', '붉은 인장'],
		['Ansi · summer 645', 'The Emperor', '황제']
	],
	Buyeo: [
		['The Egg', 'The Boy', '아이'],
		['The Side Room', 'The Plot', '음모'],
		['The Flight', 'The River', '강']
	],
	Jolbon: [
		['The Scouts', 'The Exile', '망명객'],
		['The Hunt Muster', 'Sosuno', '소서노'],
		['Five Tribes', 'Goguryeo', '고구려']
	],
	'Seung (承)': [
		['DAY 2', 'The Pavilion', '정자'],
		['DAY 4', 'Hunger', '굶주림']
	],
	'Jeon (轉)': [
		['DAY 6', 'The Wait', '대치'],
		['DAY 8', 'The Falling Star', '떨어진 별'],
		['The Kim house, Surabol · the small hours', 'Father', '아버지']
	],
	'Gyul (結)': [
		['DAY 9', 'The Cavern', '동굴'],
		['DAY 10', 'The Gate', '성문'],
		['The Queen’s Bedside', 'The Queen', '여왕']
	],
	'Royal Secretariat': [
		['Surabol · autumn 649', 'The Plan', '구상'],
		['The Harmony Council · 651', 'The Secretariat', '집사부'],
		['The East', 'The Answer', '답서']
	],
	Talhae: [
		['Dapana, a thousand li beyond the East', 'The Chest', '궤짝'],
		['Mount Toham', 'The Whetstone', '숫돌'],
		['Surabol · 57', 'King', '왕']
	],
	Exile: [
		['The Monastery', 'Two Houses', '두 가문'],
		['The Drill Ground', 'The Arrow', '화살'],
		['Tamla', 'The Island', '섬']
	],
	Descent: [
		['Nightmares', 'The Dream', '꿈'],
		['The Corridor', 'The Fox', '여우'],
		['The Monastery', 'The Last Memorial', '마지막 상소']
	],
	Sabi: [
		['The Red Fowl’s Tent', 'The Allies', '동맹'],
		['Night Flight', 'The Fall', '함락'],
		['The Victory Feast', 'Victory', '승전']
	],
	'Ungjin Commandery': [
		['Chang’an', 'The Spoils', '전리품'],
		['The Black Tortoise', 'Restoration', '부흥']
	],
	'Pyongyang I': [
		['The Wall', 'The City', '도성'],
		['The Frozen River', 'The Amnok', '압록'],
		['Surabol', 'The Rice', '쌀']
	],
	'Snake River': [
		['The Ford', 'The Snake', '사수'],
		['The Rice Road', 'The Old Marshal', '노장']
	],
	Betrayal: [
		['The King’s Room', 'Boksin', '복신'],
		['Four Banners', 'The Landing', '상륙']
	],
	'White River': [
		['The Shore', 'The Fleets', '함대'],
		['The Tide', 'The Battle', '해전'],
		['Juryu', 'The Surrender', '항복']
	],
	'Pyongyang II': [
		['The Ninth Invasion', 'The Siege', '포위'],
		['Betrayal from Inside', 'The Monk', '승려'],
		['Zhaoling', 'After', '그 뒤']
	],
	'Prosperity Mountain': [
		['The Ancestral Temple', 'The Paper', '문서'],
		['Bear Ford, Three Summers Earlier', 'The Oath', '맹세'],
		['The Ancestral Temple', 'Tonight', '오늘 밤', 2]
	],
	'The King for All': [
		['The Collar', 'The King', '왕'],
		['Five Summers Later', 'The Dragon', '용']
	]
};

/** Part titles to restore: id → title. */
const PART_TITLES = { 'silla-tang-war': 'Silla-Tang War' };

editStory((chapters) => {
	const entries = chapters.flatMap((c) => c.entries);
	let added = 0;

	for (const [title, stories] of Object.entries(STORIES)) {
		const entry = entries.find((e) => e.title === title);
		if (!entry) throw new Error(`no episode “${title}”`);
		for (const [scene, label, ko, nth = 1] of stories) {
			if (entry.blocks.some((b) => b.kind === 'story' && b.label === label)) continue;
			let seen = 0;
			const at = entry.blocks.findIndex(
				(b) => (b.kind === 'scene' || b.kind === 'day') && b.label === scene && ++seen === nth
			);
			if (at < 0) throw new Error(`${title}: no scene “${scene}” (#${nth})`);
			entry.blocks.splice(at, 0, { kind: 'story', label, ko });
			added++;
		}
	}

	for (const [id, title] of Object.entries(PART_TITLES)) {
		const part = chapters.find((c) => c.id === id);
		if (!part) throw new Error(`no part “${id}”`);
		part.title = title;
	}

	console.log(`stories added: ${added}`);
});
