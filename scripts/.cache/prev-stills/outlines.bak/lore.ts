import type { StoryLore } from './types';

/** Legends, concepts, creeds and sobriquets per story slug, merged into each outline by `index.ts`. */
export const STORY_LORE: Record<string, StoryLore> = {
	khagan: {
		creeds: {
			Kublai: {
				stance: 'Pragmatic sinicizer',
				wants: 'To rule China as a Mongol, not to become Chinese. The empire as a state that collects taxes, not a raid that never ends.',
				verdict: 'partly',
				history:
					'Backed on the method: Confucian and Buddhist advisers, a Chinese dynastic name (Yuan), a walled capital at Dadu, paper money, Chinese court ritual. Not backed on the motive. He never made Mongols adopt local customs; he ranked them above everyone else (Mongols, then Central Asians, then northern Chinese, then southern Chinese), never revived the civil-service exams, barely read Chinese, and spent every summer hunting on the steppe at Shangdu. Call him a modernizer of the state, not a civilizer of his people.'
			},
			'Ariq Böke': {
				stance: 'Steppe legitimist',
				wants: 'Grandfather’s empire run from Grandfather’s homeland, and the throne that custom already put in his hands.',
				verdict: 'partly',
				history:
					'His coalition really was the steppe establishment: Möngke’s officials, the Karakorum court, most of Möngke’s family. But the “nomad purist” label comes mostly from the winners’ histories. As youngest son he was the otchigin, keeper of the hearth, and regent in Karakorum (a city with Muslim, Christian and Chinese residents). His kurultai had more princes at it than Kublai’s. The stronger dramatic truth: he was the legal heir by custom, and lost to grain.'
			},
			Möngke: {
				stance: 'Restorationist centralizer',
				wants: 'Genghis’s empire, run exactly as Genghis ran it, with every account balanced.',
				verdict: 'backed',
				history:
					'Juvaini and Rashid al-Din both praise his austerity and control: a full imperial census, the purge of the Ögedeids, the audit of Kublai in 1257, envoys and religious debates at Karakorum. He is the last khan the whole family obeyed.'
			},
			Hulagu: {
				stance: 'Terror at the gate, astronomers in the garden',
				wants: 'A kingdom of his own, as far from his brothers as a horse can go.',
				verdict: 'partly',
				history:
					'The brutality is real but it is policy, not appetite: Baghdad (1258) was sacked and massacred because it resisted, which was standard Mongol practice, and the caliph was executed. There is no source for personal sexual sadism. The same man founded the Ilkhanate, built the Maragheh observatory for Nasir al-Din Tusi, leaned Buddhist, and let his Christian wife Doquz spare Baghdad’s Christians. Play him as charming, curious and merciless, which is scarier than a sadist.'
			},
			Batu: {
				stance: 'Kingmaker and consolidator',
				wants: 'His own house safe from the Ögedeids, and nobody’s boot on his neck at a kurultai.',
				verdict: 'partly',
				history:
					'He led the western campaign of 1236–42 (Russia, Poland, Hungary), so “expansionist into Europe” is true for six years. But the campaign was ordered by Ögedei and run largely by the old general Subutai, and after the withdrawal of 1242 Batu never went back. His last thirteen years are about succession and Rus’ tribute: he refuses to attend Güyük’s election, nearly fights him, then makes Möngke khan.'
			},
			'Sorghaghtani Beki': {
				stance: 'Patience as policy',
				wants: 'The throne for her sons, and for them to stay brothers.',
				verdict: 'backed',
				history:
					'Rashid al-Din, Bar Hebraeus and even the Franciscan envoys praise her: she refused Ögedei’s marriage offer, kept Tolui’s army loyal, educated her sons in several religions and administrations, warned Batu about Güyük, and engineered Möngke’s election. Her second wish fails within a decade of her death.'
			},
			Berke: {
				stance: 'Faith and grazing rights',
				wants: 'Revenge for Baghdad, and the Caucasus pastures his cousin took.',
				verdict: 'backed',
				history:
					'Mamluk and Persian sources record his anger at the caliph’s death and his alliance with Egypt. The land dispute over Azerbaijan was at least as real as the religion. The first open Mongol-against-Mongol war, 1262.'
			},
			Chabi: {
				stance: 'The conscience with a budget',
				wants: 'Her husband on the throne and humble on it.',
				verdict: 'backed',
				history:
					'The Yuanshi gives her the 1259 warning, her thrift (bowstrings recycled into cloth), her design of a brimmed hat and a sleeveless coat, and her pity for the captured Song empress dowager.'
			}
		},
		sobriquets: {
			Kublai: ['Setsen, the Wise', 'Shizu of Yuan (世祖)', 'The Grand Khan of Marco Polo', 'The Khan who stayed in the city'],
			Möngke: ['The Auditor', 'Grandfather’s ghost'],
			Hulagu: ['The Ilkhan', 'The New Constantine (to the Eastern Christians)', 'The Destroyer of Baghdad'],
			'Ariq Böke': ['The Hearth-Prince (otchigin)', 'Khan of Karakorum'],
			Batu: ['Sain Khan, the Good Khan', 'Lord of the Golden Horde'],
			'Sorghaghtani Beki': ['The Widow', 'Mother of Khans'],
			Berke: ['The Muslim Khan']
		},
		legends: [
			{
				name: 'Genghis Khan',
				ko: '칭기즈 칸',
				body: 'Grandfather. Everyone quotes him and nobody agrees on what he meant. Kublai quotes the conqueror who used Chinese ministers; Ariq quotes the boy who slept in a felt tent.'
			},
			{
				name: 'Tengri, the Eternal Blue Sky',
				ko: '텡그리',
				body: '“By the power of Eternal Heaven” opens every Mongol order. Heaven gave the family the world; losing it is a kind of blasphemy.'
			},
			{
				name: 'The mandate to conquer the world',
				body: 'The Mongol belief that Heaven had given all peoples to Genghis’s house, so any ruler who refused to submit was a rebel, not an enemy. Güyük wrote it to the Pope. Kublai wrote it to Japan.'
			},
			{
				name: 'Alan Qo’a’s five arrows',
				body: 'The ancestress gives each of her five quarrelling sons one arrow to break, then a bundle of five they cannot. The family’s founding parable about unity, told to every Mongol child, including four brothers who will each break their own arrow.'
			},
			{
				name: 'The Blue Wolf and the Fallow Doe',
				ko: '푸른 늑대와 흰 사슴',
				body: 'The origin of the Mongols in the Secret History: a wolf born with a destiny from Heaven and a doe crossing the lake together to Burkhan Khaldun.'
			},
			{
				name: 'Burkhan Khaldun',
				body: 'The sacred mountain where young Temüjin hid from his enemies and where Genghis is said to be buried. Unvisited, unmarked, unforgotten.'
			},
			{
				name: 'Prester John',
				body: 'The Christian king of the East that European envoys hope to find. Some think he was a Kerait khan; Sorghaghtani and Doquz were Kerait princesses.'
			}
		],
		concepts: [
			{
				name: 'Kurultai',
				ko: '쿠릴타이',
				body: 'The great assembly of princes and generals that elects a khan. Anyone who stays away can call it illegal, which is why every succession becomes a war.'
			},
			{
				name: 'Otchigin',
				ko: '옷치긴',
				body: 'The youngest son, “prince of the hearth”, who by custom inherits the home pasture and the father’s camp. It is why Ariq Böke holds Karakorum, and why he thinks it is his.'
			},
			{
				name: 'Ulus',
				body: 'A people-and-territory given to a branch of the family. The Golden Horde is the ulus of Jochi; the Ilkhanate becomes Hulagu’s. Ulus by ulus, the empire turns into four.'
			},
			{
				name: 'The Yassa',
				body: 'Genghis’s law, half written code and half remembered sayings. No royal blood may be spilled, which is why princes are rolled in carpets or felt.'
			},
			{
				name: 'The Yam',
				body: 'The relay of post-stations and fresh horses across the empire. Whoever controls the yam hears the news first; Chabi’s message reaches Kublai on it.'
			},
			{
				name: 'Keshig',
				body: 'The imperial guard, the khan’s household and training school for officers. Loyal to the person, not the office.'
			},
			{
				name: 'Ordo',
				body: 'A wife’s camp: her own tents, herds, servants and income. Mongol queens are landowners, which is how Sorghaghtani can run a faction.'
			},
			{
				name: 'Darughachi',
				body: 'The Mongol overseer in a conquered city: tax, census, order. Goryeo gets them too.'
			},
			{
				name: 'Paiza',
				body: 'A gold, silver or wood tablet that proves you speak with the khan’s authority. Marco Polo carried one.'
			},
			{
				name: 'The four classes',
				body: 'Kublai’s ranking of his subjects: Mongols, semu (Central Asians and westerners), Han (northern Chinese, Khitans, Jurchens, Koreans), and Nanren (southern Chinese). The modernizer’s China is a hierarchy.'
			}
		]
	},

	xiangyu: {
		creeds: {
			'Xiang Yu': {
				stance: 'Aristocratic restorationist',
				wants: 'The old Chu back, the old kingdoms back, and to go home to Chu in silk where everyone can see.',
				verdict: 'backed',
				history:
					'Grandson of the Chu general Xiang Yan, the Shiji’s greatest fighter, and politically a man of the old world: after Qin he hands out eighteen kingdoms instead of founding an empire, and moves home to Pengcheng. “Difficult to work with” is the Shiji’s verdict too. Han Xin says he has “a common man’s courage and a woman’s kindness”: he weeps over a sick soldier but rubs a seal of office in his hand until the corners wear off rather than give it away. Fan Zeng quits him. Add what the outline must not soften: he buries two hundred thousand surrendered Qin soldiers alive at Xin’an and burns Xianyang.'
			},
			'Liu Bang': {
				stance: 'The great delegator',
				wants: 'To win, and then to keep it in the family.',
				verdict: 'partly',
				history:
					'Humble origins: backed, a village constable from Pei. Social genius and a brilliant cast: backed in his own words at the victory banquet, “I am not as good as Zhang Liang at strategy, Xiao He at supply or Han Xin at war, but I can use them; Xiang Yu had one Fan Zeng and couldn’t use him.” Betraying all of them: overstated. He destroys the independent kings who could rival his sons (Han Xin, Peng Yue, Ying Bu), but his Pei men survive: Xiao He is jailed briefly and freed, Zhang Liang retires to study immortality, Cao Shen and Chen Ping become chancellors. And Han Xin is killed by Empress Lü and Xiao He while Liu Bang is away at war. The truer, colder version: he betrays the kings, not the friends.'
			},
			'Han Xin': {
				stance: 'Genius without a politics',
				wants: 'To be seen for what he is, and repaid for the meal that saved him.',
				verdict: 'backed',
				history:
					'Almost every beat is in the Shiji: the washerwoman who fed him, crawling between the bully’s legs, the guardsman Xiang Yu ignored, Xiao He chasing him through the night, the back-to-the-river formation, the sandbags on the Wei. Serving Liu Bang through charisma is backed too: when Kuai Tong urges him to declare himself a third power, he refuses because “the King of Han gave me his own clothes and his own food.” The rebellion is the Shiji’s account but many historians suspect a frame. The Gyebek-like social blindness is a fair reading, not a diagnosis: he asks to be made king of Qi at the worst possible moment, and tells the emperor he can command a hundred thousand men while Han Xin can command “the more the better.”'
			},
			'Fan Zeng': {
				stance: 'The old strategist',
				wants: 'Liu Bang dead at dinner.',
				verdict: 'backed',
				history: 'Seventy when he joins, advises killing Liu Bang at Hongmen, is driven out by Chen Ping’s rumour campaign, and dies of an abscess on the road home.'
			},
			'Zhang Liang': {
				stance: 'The avenger who quit in time',
				wants: 'Qin destroyed for his family’s sake, then to disappear before the victors start counting.',
				verdict: 'backed',
				history: 'Han noble who tried to assassinate the First Emperor with a 120-jin hammer. Retires after the war to fast and study the Dao, and dies in bed.'
			},
			'Xiao He': {
				stance: 'The administrator',
				wants: 'The records, the granaries and the right men in the right posts.',
				verdict: 'backed',
				history: 'Seizes Qin’s maps and registers at Xianyang while everyone else loots the treasury; runs Guanzhong for the whole war. Also the man who recommends Han Xin and helps kill him: “It was Xiao He who made him, and Xiao He who undid him.”'
			},
			'Lü Zhi': {
				stance: 'The dynasty’s enforcer',
				wants: 'Her son on the throne, and nobody left who could take it.',
				verdict: 'backed',
				history: 'Kills Han Xin in the Changle Palace; later rules as empress dowager and mutilates her rival, Lady Qi. The first woman to govern a Chinese empire in all but name.'
			}
		},
		sobriquets: {
			'Xiang Yu': ['The Hegemon-King (霸王)', 'Double Pupils (重瞳)', 'A Match for Ten Thousand (萬人之敵)', 'The man who would not cross the river'],
			'Liu Bang': ['The Drunk from Pei', 'Son of the Red Emperor (赤帝子)', 'Gaozu (高祖)', 'Old Liu Ji'],
			'Han Xin': ['The Man Under the Bully’s Legs (胯下)', 'The more the better (多多益善)', 'The Matchless Warrior of the Realm (國士無雙)'],
			'Zhang Liang': ['Zifang (子房)', 'The hammer at Bolangsha'],
			'Xiao He': ['Prime Minister Xiao', 'First among the founding servants'],
			'Fan Zeng': ['Yafu, Second Father (亞父)'],
			'Yu Ji': ['Beauty Yu (虞美人)']
		},
		legends: [
			{
				name: 'The First Emperor',
				ko: '시황제',
				hanja: '始皇帝',
				body: 'The man who ended the Warring States and wanted to rule for ten thousand generations. His procession passes Xiang Yu once and Liu Bang once. One says “that man can be replaced”; the other says “that’s what a real man should be.”'
			},
			{
				name: 'Even with three households, Chu will destroy Qin',
				hanja: '楚雖三戶 亡秦必楚',
				body: 'The prophecy every Chu child knows. It is why the rebels crown a shepherd boy as King Huai of Chu: the grudge needs a king to rally to.'
			},
			{
				name: 'King Huai of Chu',
				hanja: '楚懷王',
				body: 'The old Chu king lured to Qin and held there till he died. Chu never forgave it. The rebels give his title to his grandson, and his promise (“the first into Guanzhong rules it”) starts the war.'
			},
			{
				name: 'Qu Yuan',
				ko: '굴원',
				body: 'The loyal Chu minister who drowned himself when the court ignored him. Chu’s patron saint of being right too early; Fan Zeng knows the feeling.'
			},
			{
				name: 'Chen Sheng: are kings and generals born?',
				hanja: '王侯將相寧有種乎',
				body: 'The conscript whose rebellion broke Qin. His question frames the whole book: Xiang Yu says yes, Liu Bang says no.'
			},
			{
				name: 'The White Snake',
				body: 'Liu Bang, drunk on a night road, cuts a white snake in half; an old woman weeps that the Red Emperor’s son has killed the White Emperor’s. His men start following him. Propaganda, and very effective.'
			},
			{
				name: 'Jing Ke',
				body: 'The assassin who nearly killed the First Emperor with a dagger rolled in a map. Proof that the emperor can bleed.'
			}
		],
		concepts: [
			{
				name: 'Commanderies and counties',
				hanja: '郡縣',
				body: 'Qin’s centralised state: governors appointed by the throne, not hereditary lords. Xiang Yu dismantles it; Liu Bang quietly rebuilds it.'
			},
			{
				name: 'Enfeoffment',
				hanja: '封建',
				body: 'The old Zhou order of hereditary kingdoms. Xiang Yu restores it with eighteen kings, and they start fighting each other within months.'
			},
			{
				name: 'The Three-Article Code',
				hanja: '約法三章',
				body: 'Liu Bang’s promise to Guanzhong: murder, injury and theft are punished, everything else in Qin law is cancelled. The cheapest popularity in history.'
			},
			{
				name: 'Hegemon-King',
				hanja: '霸王',
				body: 'Xiang Yu’s self-chosen title: first among kings, not emperor over them. The title is the politics.'
			},
			{
				name: 'Emperor',
				hanja: '皇帝',
				body: 'The First Emperor’s new word. Liu Bang takes it in 202 BC; the Hegemon-King never wanted it.'
			},
			{
				name: 'Breaking the cauldrons',
				hanja: '破釜沈舟',
				body: 'Burn the boats, smash the cooking pots, three days’ food: fight to win or die. Julu, and an idiom ever since.'
			},
			{
				name: 'Songs of Chu on four sides',
				hanja: '四面楚歌',
				body: 'Gaixia: the enemy camp sings Xiang Yu’s home songs, and he thinks Chu has gone over. Now the idiom for being completely alone.'
			}
		]
	},

	chunchu: {
		creeds: {
			'Guan Zhong': {
				stance: 'Wealth before virtue',
				wants: 'To matter, and to be right about how a state works.',
				verdict: 'backed',
				history: 'The Shiji and the Guanzi (written by his school, later) credit him with the four occupations, the salt-and-iron monopoly and the neighbourhood army. Confucius grudgingly praises him: “Without Guan Zhong we would all be wearing our hair loose and buttoning our robes on the left.”'
			},
			'Bao Shuya': {
				stance: 'Judge of men',
				wants: 'For his friend to be what he already sees in him.',
				verdict: 'backed',
				history: 'The friendship is the Shiji’s, and so is the refusal: on his deathbed Guan Zhong says Bao is too upright to be chief minister, because he never forgets a fault. Bao takes it as a compliment.'
			},
			'Duke Huan of Qi': {
				stance: 'Appetite with a mandate',
				wants: 'Everything: women, food, glory, the first place at every covenant.',
				verdict: 'backed',
				history: 'Zuozhuan and Shiji: the first hegemon, nine covenants, the slogan “honour the king, expel the barbarians”, and the death in a walled-up bedroom, unburied for sixty-seven days.'
			}
		},
		sobriquets: {
			'Guan Zhong': ['Zhongfu, Uncle Zhong (仲父)', 'The archer who missed', 'The first economist'],
			'Bao Shuya': ['The friend who knew him (知己)'],
			'Duke Huan of Qi': ['The First Hegemon (首霸)', 'Prince Xiaobai, the corpse who won the race']
		},
		legends: [
			{ name: 'The Three Sovereigns and Five Emperors', hanja: '三皇五帝', body: 'The sage rulers before history: Fuxi, Shennong, the Yellow Emperor, Yao, Shun. Every argument about good government ends up quoting them.' },
			{ name: 'Yao and Shun’s abdication', hanja: '禪讓', body: 'Yao passed the throne to the worthiest man, not his son. The golden age every minister wishes his duke remembered.' },
			{ name: 'Yu and the Flood', hanja: '大禹治水', body: 'Yu tamed the waters, passed his own door three times without going in, and founded the Xia. The model of a minister who works.' },
			{ name: 'The fall of Shang', body: 'King Zhou of Shang, the wine pool and the meat forest, and the Zhou army that overthrew him: the proof that Heaven changes its mind.' },
			{ name: 'Kings Wen and Wu, and the Duke of Zhou', body: 'The founders and the regent who wrote the rites. Every Spring and Autumn lord claims to serve their order while ignoring it.' },
			{ name: 'King You and the beacon fires', body: 'The Zhou king who lit the war beacons to make his concubine laugh, and was killed when nobody came. The reason the Zhou kings are weak and need a hegemon at all.' },
			{ name: 'The Nine Cauldrons', hanja: '九鼎', body: 'Yu’s bronze vessels, symbol of the right to rule. Asking how heavy they are is treason. Chu asks.' }
		],
		concepts: [
			{ name: 'Hegemon', hanja: '霸', body: 'The strongest lord, who leads the covenants in the king’s name. Power with permission.' },
			{ name: 'Honour the king, expel the barbarians', hanja: '尊王攘夷', body: 'Guan Zhong’s slogan: protect the powerless Zhou king, so nobody can call your power a usurpation.' },
			{ name: 'The covenant', hanja: '會盟', body: 'Lords meet, sacrifice an animal and smear its blood on their lips to swear. Qi holds nine of them.' },
			{ name: 'The rites', hanja: '禮', body: 'The rules of rank, mourning, sacrifice and precedence. The duke who breaks them is talked about for centuries.' },
			{ name: 'The four occupations', hanja: '四民分業', body: 'Scholars, farmers, artisans, merchants, each living in their own quarter so skills pass down. Guan Zhong’s social engineering.' },
			{ name: 'Salt and iron', hanja: '官山海', body: 'State control of the two goods everyone must buy. The first monopoly finance in Chinese history.' },
			{ name: 'Neighbourhood army', body: 'Households grouped into fives, villages into companies: the same men farm, worship and fight together.' }
		]
	},

	husam: {
		creeds: {
			'Gyeon Hwon': {
				stance: 'Baekje revanchist',
				wants: 'To avenge Euija, and to be loved by his sons.',
				verdict: 'backed',
				history: 'The Samguk Sagi records his Wansan speech on Euija’s grievance and his letters boasting he will water his horses in the Taedong. His sons’ coup and his defection to Wang Geon are recorded; the sentimentality is ours.'
			},
			'Gung Ye': {
				stance: 'Messianic absolutist',
				wants: 'To be seen, and to see into every heart.',
				verdict: 'partly',
				history: 'The Maitreya claim, the gwansim mind-reading, the purges and the murder of his wife and sons are in the Samguk Sagi, but that history was written by the dynasty that overthrew him. Modern historians read part of it as Goryeo propaganda. The outline lets the reader suspect both.'
			},
			'Wang Geon': {
				stance: 'Coalition-builder',
				wants: 'To survive the monk, and then to be owed by everyone.',
				verdict: 'backed',
				history: 'Twenty-nine marriages into regional families, the reception of Balhae refugees, generous treatment of Silla’s last king and of Gyeon Hwon: all recorded. The Ten Injunctions are his testament (some scholars doubt parts).'
			},
			'Sin Sung-gyeom': {
				stance: 'Loyalty to a person',
				wants: 'To be useful to one man.',
				verdict: 'backed',
				history: 'At Gongsan (927) he wears Wang Geon’s armour so the king can escape, and dies in his place. Goryeo honours him for centuries.'
			}
		},
		sobriquets: {
			'Gyeon Hwon': ['The Tiger’s Milk', 'The Spear Pillow', 'Sangbu, Honoured Father'],
			'Gung Ye': ['The One-Eyed Maitreya', 'The Thrown-Away Prince', 'Seonjong the monk'],
			'Wang Geon': ['The Bridegroom of Samhan', 'Taejo (太祖)', 'The Listener'],
			'Sin Sung-gyeom': ['The King’s Double']
		},
		legends: [
			{ name: 'Euija’s grievance', ko: '의자의 숙분', body: 'The fall of Baekje in 660, two and a half centuries old, and still the best recruiting speech in the southwest.' },
			{ name: 'Goguryeo and Pyongyang gone to weeds', body: 'The lost northern kingdom. Gung Ye names his state for it; Wang Geon keeps the name.' },
			{ name: 'Hwangsan', ko: '황산', body: 'The plain where Gyebek fell. Gyeon Hwon names it in a speech and dies near it.' },
			{ name: 'Maitreya, the Buddha to come', ko: '미륵', body: 'The future Buddha who will end a corrupt age. Every peasant has heard of him; Gung Ye says he is him.' },
			{ name: 'Doseon’s prophecy', body: 'The geomancer who told the Wang family where to build and promised a son who would rule the Three Hans.' },
			{ name: 'Munmu’s sea tomb', body: 'The king who unified Samhan asked to be buried in the sea as a dragon to guard it. Silla’s founding myth of its own unification.' },
			{ name: 'Jang Bogo', ko: '장보고', body: 'The island king the bone ranks murdered. Every sea family remembers what happens when a rich man asks for a chair.' }
		],
		concepts: [
			{ name: 'Bone rank', ko: '골품제', body: 'Silla’s birth caste: sacred bone, true bone, head ranks six to one. Choe Chiwon’s ceiling is six.' },
			{ name: 'Castle lords', ko: '호족 · 성주장군', body: 'Local strongmen with walls, men and grain, who now call themselves generals. Whoever wins them wins Samhan.' },
			{ name: 'Gwansim', ko: '관심법', hanja: '觀心法', body: 'Gung Ye’s mind-reading: he looks at you and declares what you are thinking. There is no defence except confessing.' },
			{ name: 'Marriage alliances', ko: '혼인정책', body: 'Wang Geon’s twenty-nine wives: every marriage is a treaty with a castle lord.' },
			{ name: 'Hostages and inspectors', ko: '기인 · 사심관', body: 'Lords’ sons kept at court as guests; former local magnates made answerable for their home regions. The early Goryeo leash.' },
			{ name: 'Geomancy', ko: '풍수', body: 'Doseon’s science of land and energy. It chooses capitals, temples and, the Wangs say, kings.' },
			{ name: 'The Ten Injunctions', ko: '훈요십조', body: 'Wang Geon’s testament to his heirs. The eighth, about the people south of the Charyeong range, is still argued over.' }
		]
	},

	sijo: {
		creeds: {
			'Ying Zheng': { stance: 'Total unification', wants: 'One law, one script, one measure, forever.', verdict: 'backed', history: 'Standardised script, weights, axles and law; burned books; searched for immortality.' },
			'Liu Xiu': { stance: 'Restoration through gentleness', wants: 'The Han back, and a quiet life after.', verdict: 'backed', history: 'Restored the Han in AD 25 and was known for clemency toward rivals and loyalty to his first wife’s memory.' },
			'Yang Jian': { stance: 'Reunifier by paperwork', wants: 'The empire whole, and his wife’s approval.', verdict: 'backed', history: 'Reunited China in 589, built the institutions the Tang inherited, and kept his monogamy oath to Dugu Qieluo for most of his life.' },
			'Li Shimin': { stance: 'The listening emperor', wants: 'To be remembered as the best emperor, not the man who killed his brothers.', verdict: 'backed', history: 'Xuanwu Gate (626), then a famous reign of taking criticism from Wei Zheng. He had the court histories of the coup edited.' },
			'Zhu Yuanzhang': { stance: 'Peasant autocrat', wants: 'No official ever again stealing from a farmer.', verdict: 'backed', history: 'Orphan, monk, beggar, rebel, founder of the Ming; abolished the chancellorship and purged tens of thousands of officials.' }
		},
		sobriquets: {
			'Ying Zheng': ['The First Emperor (始皇帝)', 'The Tiger of Qin'],
			'Liu Xiu': ['Guangwu (光武)', 'The Emperor of Restoration'],
			'Yang Jian': ['Wendi of Sui', 'The Henpecked Unifier'],
			'Li Shimin': ['Taizong (太宗)', 'The Heavenly Khagan (天可汗)'],
			'Zhu Yuanzhang': ['The Hongwu Emperor (洪武)', 'The Beggar Emperor']
		},
		legends: [
			{ name: 'Bian He’s jade', hanja: '和氏璧', body: 'A man loses both feet trying to prove a stone is jade. It becomes the Heirloom Seal.' },
			{ name: 'The Mandate of Heaven', hanja: '天命', body: 'Heaven gives the throne to the virtuous and takes it back. Every founder must prove it chose him.' },
			{ name: 'The Five Phases', hanja: '五德終始', body: 'Each dynasty rules by an element and is replaced by the next: Qin water, Han fire or earth, Sui fire, Tang earth.' },
			{ name: 'Yellow Emperor', hanja: '黃帝', body: 'The ancestor every dynasty claims.' }
		],
		concepts: [
			{ name: 'The Heirloom Seal', hanja: '傳國玉璽', body: '“Having received the Mandate from Heaven, may the reign be long and prosperous.” Whoever holds it is legitimate, until it is lost.' },
			{ name: 'Abdication ritual', hanja: '禪讓', body: 'The polite fiction by which a puppet emperor “yields” to the man who already owns the army.' },
			{ name: 'The examinations', hanja: '科擧', body: 'Sui invents them, Tang expands them, Song makes them the road to power.' },
			{ name: 'Equal-field system', hanja: '均田制', body: 'The state allots land per household: the fiscal engine of Sui and early Tang.' },
			{ name: 'The Eight Banners', body: 'Hong Taiji’s military-social order of the Manchus.' }
		]
	},

	shahanshah: {
		creeds: {
			Cyrus: { stance: 'Conquest by consent', wants: 'Every people to keep its gods and pay him tribute.', verdict: 'partly', history: 'The Cyrus Cylinder and the return of the Judeans support a policy of restoring local cults. It is also propaganda, written for Babylon’s priests after he took the city.' },
			Astyages: { stance: 'Dynastic paranoia', wants: 'No grandson to take his throne.', verdict: 'dramatized', history: 'The dreams, the exposure and Harpagus’s dinner come from Herodotus, who says he knows four versions.' },
			Harpagus: { stance: 'Revenge as statecraft', wants: 'Astyages to lose everything, as he did.', verdict: 'partly', history: 'Herodotus: the general who defected at the decisive battle. The eaten son is his story.' }
		},
		sobriquets: {
			Cyrus: ['The Great', 'King of the Four Corners', 'The Anointed (Isaiah 45)', 'The Herdsman’s Son'],
			Astyages: ['The Dreamer'],
			Harpagus: ['The Man Who Ate at the King’s Table']
		},
		legends: [
			{ name: 'Astyages’ dreams', body: 'A flood from his daughter’s womb, a vine that covers Asia. The prophecy that makes him try to kill the baby.' },
			{ name: 'The dog who nursed Cyrus', body: 'The herdsman’s wife was called Spako, “bitch”, so the legend grew that a dog nursed him.' },
			{ name: 'Croesus and the oracle', body: '“If you cross the Halys, you will destroy a great empire.” His own.' },
			{ name: 'Marduk of Babylon', body: 'The god whose priests turn against Nabonidus and welcome Cyrus.' },
			{ name: 'Deioces the judge', body: 'The Median founder who made himself king by being the fairest judge, then hid behind seven walls.' }
		],
		concepts: [
			{ name: 'Satrapy', body: 'A province under a governor with local customs kept. Cyrus’s template for the first world empire.' },
			{ name: 'The Cyrus Cylinder', body: 'The clay proclamation of Babylon’s conquest: gods restored, captives sent home.' },
			{ name: 'Truth and the Lie', body: 'Arta and drauga: the Persian moral binary. Kings rule by the truth; rebels are liars.' },
			{ name: 'The Persian tribes', body: 'Pasargadae, Maraphii, Maspii: Cyrus’s own clan and the nobles who make him king.' }
		]
	},

	judges: {
		creeds: {
			Joshua: { stance: 'Covenant conquest', wants: 'The land promised to Moses, and the people faithful in it.', verdict: 'partly', history: 'The book of Joshua tells a swift conquest; Judges and archaeology suggest a slow settlement over generations. The outline plays the tension.' },
			Deborah: { stance: 'Prophetic judgment', wants: 'Israel to stop waiting for a man to save it.', verdict: 'backed', history: 'Judges 4–5; the Song of Deborah is among the oldest Hebrew poetry.' },
			Gideon: { stance: 'Reluctant deliverer', wants: 'Proof, and then more proof.', verdict: 'backed', history: 'Judges 6–8: the fleece, three hundred men, and his refusal of the crown (while naming his son “my father is king”).' },
			Samson: { stance: 'Strength without discipline', wants: 'Whatever he sees.', verdict: 'backed', history: 'Judges 13–16; the folk-hero texture is the text’s own.' }
		},
		sobriquets: {
			Joshua: ['Son of Nun', 'Moses’ servant'],
			Deborah: ['Mother in Israel'],
			Gideon: ['Jerubbaal, “let Baal contend”', 'Mighty man of valour (said sarcastically by an angel)'],
			Samson: ['The Nazirite', 'The Danite strongman']
		},
		legends: [
			{ name: 'The Exodus', body: 'Slavery in Egypt, the sea parted, the generation that died in the desert.' },
			{ name: 'Abraham’s promise', body: 'Land and descendants like the stars. Every battle cashes it in.' },
			{ name: 'Sinai', body: 'The covenant and the law: blessing for obedience, curses for the rest.' },
			{ name: 'The Anakim', body: 'The giants the spies saw in Canaan, which kept a generation out of the land.' }
		],
		concepts: [
			{ name: 'The twelve tribes', body: 'A confederation with no king, no capital and no army except who answers the trumpet.' },
			{ name: 'The ban', ko: '헤렘', body: 'Herem: a city devoted entirely to God, nothing taken. Achan takes something.' },
			{ name: 'The judge', ko: '사사', body: 'Shofet: a deliverer raised for one crisis, not a dynasty.' },
			{ name: 'The Nazirite vow', body: 'No wine, no corpses, no razor. Samson breaks all three.' },
			{ name: 'The Ark of the Covenant', body: 'The gold chest that goes before the army. It crosses the Jordan first.' }
		]
	},

	'lord-and-shepherd': {
		creeds: {
			David: { stance: 'The anointed outlaw', wants: 'God’s favour, and everything he looks at.', verdict: 'backed', history: 'Samuel’s books are unusually frank: the giant, the outlaw years, Bathsheba, Absalom. The Tel Dan stele names a “House of David”.' },
			Saul: { stance: 'The first king, unchosen twice', wants: 'To keep a crown he never asked for.', verdict: 'backed', history: '1 Samuel: anointed, then rejected, then haunted.' },
			Jonathan: { stance: 'Love over succession', wants: 'David to have what was his.', verdict: 'backed', history: 'He gives David his robe, sword and bow, and dies beside his father at Gilboa.' }
		},
		sobriquets: {
			David: ['The Sweet Singer of Israel', 'The man after God’s own heart', 'Son of Jesse'],
			Saul: ['Head and shoulders above the rest'],
			Jonathan: ['The bowman of Michmash']
		},
		legends: [
			{ name: 'Moses and the Exodus', body: 'The founding memory everyone swears by.' },
			{ name: 'The judges', body: 'Samson, Gideon, Deborah: the heroes Israel’s elders want replaced with a king.' },
			{ name: 'Ruth of Moab', body: 'David’s great-grandmother, a foreigner. It comes up when it is useful.' },
			{ name: 'The Ark at Shiloh', body: 'Captured by the Philistines, returned with plagues. David will dance it into Jerusalem.' }
		],
		concepts: [
			{ name: 'Anointing', body: 'Oil poured by a prophet: the mashiach. Saul and David are both anointed, at the same time.' },
			{ name: 'The prophet as kingmaker', body: 'Samuel makes and unmakes; Nathan rebukes. Kings answer to someone.' },
			{ name: 'The Mighty Men', body: 'David’s outlaw band turned royal guard. Uriah is one of them.' },
			{ name: 'Philistine iron', body: 'The Philistines control the smiths; Israel sharpens its ploughs at their forges.' }
		]
	},

	kings: {
		creeds: {
			Solomon: { stance: 'Wisdom as statecraft', wants: 'Peace, a temple, and every alliance a marriage can buy.', verdict: 'partly', history: 'The scale of his kingdom is debated by archaeologists; the text itself criticises the wives, horses and forced labour.' },
			Elijah: { stance: 'Yahweh alone', wants: 'Baal gone from Israel.', verdict: 'backed', history: '1 Kings 17–19, 21 and 2 Kings 2.' },
			Jezebel: { stance: 'Royal absolutism', wants: 'Baal’s kingdom, and a king who acts like one.', verdict: 'partly', history: 'The text is hostile; a Phoenician princess raised where kings simply took vineyards.' },
			Jeremiah: { stance: 'Submit to Babylon', wants: 'Judah to live, even in chains.', verdict: 'backed', history: 'His book records the scroll burned, the cistern and the siege. Called a traitor for telling the truth.' }
		},
		sobriquets: {
			Solomon: ['Jedidiah, Beloved of the Lord', 'The Wise'],
			Elijah: ['The Tishbite', 'The Troubler of Israel (said by Ahab)'],
			Jezebel: ['Daughter of the Sidonians'],
			Jeremiah: ['The Weeping Prophet']
		},
		legends: [
			{ name: 'David’s lamp', body: 'The promise that David’s line will never lose the throne. Every disaster is measured against it.' },
			{ name: 'Moses and Sinai', body: 'The law the scroll found in the Temple claims to be.' },
			{ name: 'The Exodus calves', body: 'Jeroboam’s golden calves echo Aaron’s; the text does not miss it.' }
		],
		concepts: [
			{ name: 'The Temple', body: 'Solomon’s house for God in Jerusalem. The centre the north refuses.' },
			{ name: 'The high places', body: 'Local altars on hills. Kings are graded by whether they tore them down.' },
			{ name: 'Baal and Asherah', body: 'The storm god and the mother goddess of Canaan, rivals for Israel’s worship.' },
			{ name: 'Sons of the prophets', body: 'Prophetic guilds attached to Elijah and Elisha.' },
			{ name: 'Assyrian deportation', body: 'Whole populations moved across the empire. Samaria ends this way.' }
		]
	},

	'command-line': {
		creeds: {
			'Steve Jobs': { stance: 'Integration as art', wants: 'Hardware and software as one beautiful thing he controls.', verdict: 'backed', history: 'Isaacson, Moritz and the Mac team’s own accounts.' },
			'Bill Gates': { stance: 'Software as the toll road', wants: 'A computer on every desk running Microsoft software.', verdict: 'backed', history: 'The Open Letter to Hobbyists (1976), the IBM licence, Windows.' },
			'Steve Wozniak': { stance: 'Engineering for joy', wants: 'To build elegant boards and give them away.', verdict: 'backed', history: 'iWoz and Homebrew Club accounts.' }
		},
		sobriquets: {
			'Steve Jobs': ['The Reality Distortion Field', 'The pirate captain'],
			'Bill Gates': ['Trey', 'The kid who sold IBM an operating system he didn’t own yet'],
			'Steve Wozniak': ['The Woz']
		},
		legends: [
			{ name: 'The Mother of All Demos', body: 'Engelbart, 1968: the mouse, windows, hypertext, video calls. Everyone in the valley has heard of it; few saw it.' },
			{ name: 'Hewlett and Packard’s garage', body: 'Palo Alto, 1939. The valley’s founding myth before Apple borrowed it.' },
			{ name: 'The Traitorous Eight', body: 'The engineers who left Shockley and founded Fairchild: the valley’s original rebellion.' },
			{ name: 'IBM', body: 'Big Blue, the mainframe giant. Everyone’s Goliath.' },
			{ name: 'The Whole Earth Catalog', body: '“Stay hungry. Stay foolish.” The counterculture’s tool manual.' }
		],
		concepts: [
			{ name: 'GUI', body: 'Windows, icons, menus, pointer: invented at PARC, sold by Apple, licensed by Microsoft.' },
			{ name: 'Open versus closed', body: 'License the software to everyone, or build the whole machine yourself. The book’s war.' },
			{ name: 'Per-processor licensing', body: 'Microsoft’s fee on every PC shipped, whether DOS was installed or not.' },
			{ name: 'Venture capital and the IPO', body: 'Markkula’s money and Apple’s 1980 float: the valley’s new way to get rich.' }
		]
	}
};
