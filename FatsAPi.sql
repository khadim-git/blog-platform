-- phpMyAdmin SQL Dump
-- version 4.6.6deb5ubuntu0.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 17, 2025 at 03:15 PM
-- Server version: 5.7.42-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `FatsAPi`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `created_at`, `updated_at`) VALUES
(5, 'RESEARCH', 'research', '', '2025-12-17 14:33:22', '2025-12-17 14:33:22'),
(6, 'REGULATORY', 'regulatory', '', '2025-12-17 14:33:48', '2025-12-17 14:33:48'),
(7, 'INNOVATION', 'innovation', '', '2025-12-17 14:33:54', '2025-12-17 14:33:54'),
(8, 'PARTNERSHIPS', 'partnerships', '', '2025-12-17 14:34:01', '2025-12-17 14:34:01'),
(9, 'INSIGHTS', 'insights', '', '2025-12-17 14:34:06', '2025-12-17 14:34:06'),
(10, 'MARKET TRENDS', 'market-trends', '', '2025-12-17 14:34:23', '2025-12-17 14:34:23'),
(11, 'TECHNOLOGY', 'technology', '', '2025-12-17 14:34:30', '2025-12-17 14:34:30'),
(12, 'INVESTMENT', 'investment', '', '2025-12-17 14:34:35', '2025-12-17 14:34:35');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `content` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `approved` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `post_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `content`, `approved`, `created_at`, `post_id`, `author_id`, `parent_id`) VALUES
(20, 'sadasd', 1, '2025-12-17 15:08:46', 20, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `subject`, `message`, `is_read`, `created_at`) VALUES
(1, 'Sarah Kennedy', 'sicecaxoz@mailinator.com', 'Ratione labore enim ', 'Amet velit qui inve', 1, '2025-12-02 07:32:02'),
(2, 'Louis Valencia', 'qefel@mailinator.com', 'Cupiditate in cupida', 'Libero recusandae A', 1, '2025-12-02 11:46:22'),
(3, 'Allistair Dominguez', 'nadaro@mailinator.com', 'Incididunt in rerum ', 'Error sint omnis sed', 0, '2025-12-02 14:58:45');

-- --------------------------------------------------------

--
-- Table structure for table `email_verification_tokens`
--

CREATE TABLE `email_verification_tokens` (
  `id` int(11) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `is_used` tinyint(1) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `email_verification_tokens`
--

INSERT INTO `email_verification_tokens` (`id`, `token`, `user_id`, `is_used`, `expires_at`, `created_at`) VALUES
(1, 'U225Xc4dt_JU-7N-Bm_nH2MgEbhiNfSKKSYo9RhoZio', NULL, 0, '2025-12-02 13:47:11', '2025-12-01 13:47:11'),
(2, '4BxYI_GIkyyZUXnXEBFXfGVgqkIFlbWnRtA0MHBtC18', NULL, 0, '2025-12-02 13:48:34', '2025-12-01 13:48:34'),
(3, 'n9gbfb_eyw1ajWT4VpdsZPlctkq_HD3qA3v7EHBVOb8', NULL, 0, '2025-12-02 13:50:12', '2025-12-01 13:50:12'),
(4, 'aThC5Vwehajh9IK7SYu3tERb233Iz_kcGz4brROo--E', NULL, 0, '2025-12-02 15:43:59', '2025-12-01 15:43:59'),
(5, 'f9aXhwG9KHKGsigpT4hmuiYrw3gjUvhGp2PTgQ69jbE', NULL, 0, '2025-12-03 13:50:58', '2025-12-02 13:50:58'),
(6, 'aweoAfixT2D2S2OCtThHIe2rq2y2iKpngUDvFFwirKI', NULL, 0, '2025-12-06 14:03:52', '2025-12-05 14:03:52'),
(7, '81bbPUF2sIugvhIaIqq6plc2QUVv7t3GTONNo9BfOAI', NULL, 0, '2025-12-06 14:44:11', '2025-12-05 14:44:11'),
(8, 'XXAFKOZ5mq0JNOt2RDeGlMAv-E1nFLftO8e-95u8Xkc', NULL, 0, '2025-12-06 14:46:41', '2025-12-05 14:46:41'),
(9, 'GV4cVLdxchEfkwgQcp4EqObUHcSRYdaH5dBYMzEFQkk', NULL, 0, '2025-12-18 14:22:03', '2025-12-17 14:22:03');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `user_id`, `post_id`, `created_at`, `comment_id`) VALUES
(5, 1, NULL, '2025-12-02 13:03:47', NULL),
(14, 1, 32, '2025-12-17 15:11:01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` mediumtext COLLATE utf8mb4_unicode_ci,
  `excerpt` mediumtext COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `slug`, `content`, `excerpt`, `published`, `created_at`, `updated_at`, `author_id`, `image_url`, `tags`, `category`) VALUES
(19, 'Testing Tomorrow’s Carbon Tech in Today’s Gulf', 'testing-tomorrow-s-carbon-tech-in-today-s-gulf', 'Saudi Aramco has launched Saudi Arabia’s first direct air capture unit in Dhahran, creating a field laboratory for testing carbon removal technologies in Gulf conditions. The pilot, developed with Siemens Energy, can extract about 12 tonnes of carbon dioxide a year, but its main purpose is to assess new capture materials and system designs in high heat and humidity.\n\n\nAramco and Siemens Energy said the site will support trials of sorbents, materials that bind CO₂, and different process layouts to gauge performance and energy use. Engineers aim to understand how direct air capture could be adapted for larger industrial settings in the Middle East, where environmental factors and power costs influence operating choices.\n\n\nThe initiative aligns with Aramco’s wider carbon management strategy. The company is targeting net zero Scope 1 and 2 emissions across its wholly owned and operated assets by 2050 and views carbon capture and storage as a central tool. Aramco, Linde and SLB are advancing a carbon storage hub in Jubail that aims to handle about 9mn tonnes of CO₂ a year in its first phase. The DAC site is intended to act as a complementary source of concentrated CO₂ for potential use in low carbon fuels and chemicals.\n\n\nFor regional researchers, the Dhahran installation offers rare operational data. The pilot will allow teams to monitor capture efficiency, regeneration energy and system availability across seasons. Analysts say the results could shape later projects across the Gulf, where heat, dust and shifting electricity prices weigh on the economics of emerging climate technologies.\n\n\nThe effort comes as other Middle Eastern energy groups expand research into carbon management. In the United Arab Emirates, ADNOC and partners are testing carbon mineralisation in Fujairah to convert captured CO₂ into solid rock, while Abu Dhabi institutions are examining advanced sensing tools for subsurface monitoring.\n\n\nAs the DAC unit completes its initial year of operation, attention is likely to turn to evidence of lower costs and higher capture rates. Any progress would support regional plans to pair conventional fuel production with the development of carbon removal technologies suited to desert environments.\n', 'Aramco’s new direct air capture pilot with Siemens Energy gives the Gulf a real-world lab for carbon removal under tough desert conditions', 1, '2025-12-17 14:39:01', '2025-12-17 14:39:01', 1, 'http://localhost:8000/uploads/7b15ece6-c3ce-4bbc-b9e0-95a87883950e.jpg', NULL, NULL),
(20, 'UAE’s New Climate Rules Raise the Stakes', 'uae-s-new-climate-rules-raise-the-stakes', 'The United Arab Emirates has introduced a climate law that will require companies across the country to measure, report and manage their greenhouse gas emissions under national standards, a shift expected to influence how future shale and tight gas projects are designed across the Gulf.\n\nFederal Decree-Law No. 11 of 2024, which took effect on May 30, 2025, sets a compliance deadline of May 2026 and includes financial penalties for firms that fail to meet reporting rules. The measure moves the sector from voluntary initiatives to binding obligations at a time when the region is assessing large-scale unconventional gas options.\n\nIndustry analysts said the new framework would push national oil companies, including ADNOC, to integrate emissions monitoring and digital reporting systems more closely into project design. ADNOC has already highlighted the use of advanced analytics and artificial intelligence to monitor emissions across its assets, tools that observers expect to become more central as the company evaluates unconventional plans.\n\nIn Abu Dhabi’s Al Dhafra region, EOG Resources is appraising Unconventional Onshore Block 3 under a concession that grants it full equity and operatorship during the initial phase. Analysts expect the US group to adopt detailed emissions tracking early in the programme, noting that stronger reporting could support its position as regulatory expectations tighten and investors examine carbon performance more closely.\n\nThe law is also being watched in neighbouring markets. Saudi Aramco, which is expanding unconventional gas output at Jafurah, has placed growing attention on methane monitoring, satellite observation and digital oversight. While these efforts are not directly tied to the UAE legislation, many observers view Federal Decree-Law No. 11 of 2024 as a regional benchmark that could shape how future Gulf projects are financed and approved.\n\nService providers are adjusting to the new landscape. Consulting groups, technology suppliers and drilling contractors are offering systems that improve data quality, automate reporting and support lower-impact field development, opening commercial opportunities beyond exploration and production.\n\nSome operators caution that compliance costs will rise, especially for smaller companies and new entrants. Building emissions inventories, upgrading equipment and aligning internal systems with national platforms will require investment. Yet many industry participants see the rule as a catalyst for modernisation, arguing that better data can improve operational efficiency and help secure capital as buyers and lenders favour lower-carbon supply.\n\nAs the compliance deadline approaches, environmental performance is becoming a more central element of unconventional strategy in the Gulf, with the UAE setting an early marker through a binding legal framework.\n', 'A new UAE climate law pushes Gulf operators toward stricter tracking, reporting, and planning for future unconventional projects', 1, '2025-12-17 14:39:51', '2025-12-17 14:39:51', 1, 'http://localhost:8000/uploads/63af4e9e-12bf-4649-be8a-a660d50ffc80.jpg', NULL, NULL),
(21, 'How Jafurah Is Redefining Gulf Energy Innovation', 'how-jafurah-is-redefining-gulf-energy-innovation', 'Saudi Arabia’s push into shale gas has reached a turning point. The Jafurah field, long billed as the region’s most ambitious unconventional project, has shifted from trial work to full commercial production. Early output sits around 450 million cubic feet a day, a level that shows the kingdom is no longer testing ideas but scaling a new gas frontier.\n\n\nThe move follows an eleven billion dollar deal with Global Infrastructure Partners and BlackRock that created Jafurah Midstream Gas Company. The new venture takes ownership of pipelines and processing plants, while Aramco keeps control of the wells. Analysts see the setup as a fresh twist in regional energy finance because it frees capital and speeds construction. Some believe it may become a model for peers across the Gulf.\n\n\nJafurah’s rise fits neatly into Riyadh’s plan to broaden its fuel mix and secure more gas for power, industry, and petrochemical growth. Shifting domestic electricity generation away from crude oil also strengthens the kingdom’s export posture. Whether this marks a regional pivot into unconventional resources is less clear, since progress elsewhere depends on local geology, investment appetite, and regulatory paths.\n\n\nChallenges do linger. Water use, environmental oversight, and service capacity are often cited by specialists as areas to watch, though public data remains thin and sometimes rooted in early stage assessments. Even so, drilling crews appear to be learning fast as they tailor technology to the basin’s demands.\n\n\nIf Jafurah reaches its projected two billion cubic feet a day at peak development, it could reshape the region’s gas balance. The field has already captured the attention of investors, operators, and technology firms looking for openings that combine financial innovation with long term stability.\n\n\nWith global gas markets unsettled and competition rising, Jafurah’s progress will remain under close scrutiny. For now, it stands as a defining step in Saudi Arabia’s shifting energy landscape and a possible spark for similar advances across the Gulf.\n', 'The United Arab Emirates has introduced a climate law that will require companies across the country to measure, report and manage their greenhouse gas emissions under national standards, a shift expected to influence how future shale and tight gas projects are designed across the Gulf.', 1, '2025-12-17 14:40:47', '2025-12-17 14:46:42', 1, 'http://localhost:8000/uploads/eec1ef06-81cd-42fd-9ad8-e58ca33aeba1.jpg', NULL, NULL),
(22, 'UAE Tests a New Frontier in Shale Oil', 'uae-tests-a-new-frontier-in-shale-oil', 'EOG Resources’ appraisal of a shale prospect in the United Arab Emirates has drawn industry attention after initial drilling in the Al Dhafra area delivered early oil flows, marking a rare move toward unconventional development in the Gulf.\n\n\nThe US independent secured the acreage in 2025 and has since advanced a series of tests that analysts view as a cautious but notable step for a region dominated by low-cost conventional production. Oil flowing to the surface during early appraisal has increased expectations that the UAE could establish a foothold in shale resources long concentrated in North America.\n\n\nEOG holds full equity and operatorship during the appraisal phase. Abu Dhabi National Oil Company retains an option to join later, a structure that allows the US group to apply its experience in tight-rock drilling while giving ADNOC scope to build domestic capability once results are better understood.\n\n\nCompany executives have described the block as one of the most attractive unconventional prospects outside the US. They say the acreage offers a rare chance to deploy established shale techniques in a region that is beginning to test new forms of resource extraction.\n\n\nAnalysts note that the initiative fits a wider trend as producers examine unconventional methods to maintain competitiveness. Service companies are preparing for possible demand for specialised rigs and completion services if the project moves toward full development. Water supply and variable rock quality remain potential obstacles, although these have not damped interest in the early results.\n\n\nEconomics will be central to any next steps. Unconventional output must compete with the Gulf’s low-cost barrels, a challenge that has slowed similar efforts elsewhere in the region. Even so, early indications from Al Dhafra have increased market interest and prompted closer scrutiny of the UAE’s longer-term plans.\n\n\nAs testing continues, the country has become a focal point for investors tracking whether unconventional resources could add a new layer to the UAE’s production base. Strong appraisal results could open investment pathways and support a gradual expansion of domestic shale capacity.\n', 'EOG drives UAE shale appraisal with early success as the Gulf takes initial steps toward building unconventional oil capacity', 0, '2025-12-17 14:41:27', '2025-12-17 14:41:27', 1, 'http://localhost:8000/uploads/7f0cbb55-53a7-4cf3-ba39-d41beeabecdc.jpg', NULL, NULL),
(23, 'Is the Gulf’s Shale Bet Finally Taking Shape', 'is-the-gulf-s-shale-bet-finally-taking-shape', 'The UAE is accelerating its entry into shale, with new horizontal wells in Abu Dhabi bringing oil to the surface from an unconventional formation and prompting wider interest across the Gulf. The tests, still in the appraisal phase, have yet to show whether commercial output can be sustained.\n\n\nADNOC and EOG Resources are leading the programme in the Al Dhafra region, where early well data has been described as encouraging. Although the work remains preliminary, the results have drawn attention in a region known for large and low cost reservoirs, suggesting unconventional output could offer a modest diversification of supply.\n\n\nIndustry reactions highlight both opportunity and constraint. One ADNOC representative said the progress marked a “meaningful step toward long term energy security tied to rising domestic demand”. EOG executives have also pointed to the acreage’s potential, saying it ranks among the group’s more attractive unconventional prospects in recent years. Analysts, however, note unresolved questions around geology, cost structures and water use, factors that differ from North American shale development and could determine the viability of any full scale programme.\n\n\nStrategic aims are influencing the current work. Gulf producers are assessing how unconventional resources might expand their options as global market dynamics evolve. Some view the UAE’s early progress as a signal of future opportunity, while others expect regional producers to track the results before committing to their own shale plans.\n\n\nNeighbouring efforts are already linked. Bahrain’s Bapco Energies, which is working with EOG on gas appraisal, is expected to monitor the UAE tests as it considers next steps. Further technical success could shape investment decisions, but operators are likely to wait for clear evidence of stable production rates, sustainable costs and manageable environmental requirements.\n\n\nFor now, the region is at the start of what could become a longer appraisal cycle. Unconventional resources are not expected to displace traditional output, but they may play a supporting role if testing continues to advance and subsurface understanding improves.\n', 'ADNOC and EOG advance UAE shale drilling, signaling rising regional potential as industry tracks early results for emerging investment opportunities', 0, '2025-12-17 14:42:07', '2025-12-17 14:42:07', 1, 'http://localhost:8000/uploads/f216ab1e-ae60-4e00-94b1-8ced0aec9ba2.jpg', NULL, NULL),
(24, 'Inside the High-Stakes ADNOC–EOG Shale Experiment', 'inside-the-high-stakes-adnoc-eog-shale-experiment', 'ADNOC and US-based EOG Resources are moving ahead with appraisal work on what could become the UAE’s first commercially viable shale development, marking a rare push into unconventional production in the Gulf.\n\n\nInitial horizontal wells have brought oil to the surface from a shale formation, giving early support to the testing programme. But the partners said the work remained at an early stage, with commercial viability still unproven.\n\n\nEOG has indicated the appraisal phase could run for as long as three years. A production decision, along with potential deeper involvement from ADNOC, would come only after that period, highlighting the long lead time before any development moves forward.\n\n\nThe partnership combines ADNOC’s large resource position with EOG’s experience in US shale fields. The effort will test whether techniques used in North America can be applied under the UAE’s different geological and environmental conditions. Analysts note that shale projects outside the US have struggled to match American output because of variations in rock quality, climate and operating costs.\n\n\nIndustry reaction has been mixed. One regional adviser said the UAE was entering “territory once considered unlikely”, pointing to how early well performance had shifted expectations. Others cautioned that technical and cost hurdles remain, including complex subsurface structures, water use requirements and the high expense of early-stage drilling.\n\n\nSupply chain constraints could also slow progress. Unconventional development depends on specialised equipment, pressure-pumping fleets and advanced monitoring systems, many of which are still in limited supply in the region. Analysts said this explained why other Gulf producers were watching the UAE’s programme rather than accelerating their own.\n\n\nA successful shale project could widen the UAE’s energy mix, attract international service companies and offer a model for neighbouring producers considering whether unconventional reserves merit more detailed study. But any broader shift would depend on sustained appraisal results and clarity on long-term economics.\n\n\nFor now, the initiative marks the start of a new phase for the country’s energy sector. While shale output is unlikely to displace conventional production, it could become a complementary source if testing continues to advance.\n', 'ADNOC and EOG advance UAE shale testing, signaling emerging potential as stakeholders monitor early results for future investment decisions', 0, '2025-12-17 14:42:44', '2025-12-17 14:42:44', 1, 'http://localhost:8000/uploads/0855fd9e-2a9e-4716-8ba2-240043869719.jpg', NULL, NULL),
(25, 'Can Rich Gas Reinvent the Gulf’s Energy Strategy?', 'can-rich-gas-reinvent-the-gulf-s-energy-strategy', 'ADNOC Gas’s decision in June to approve the first phase of its Rich Gas Development scheme marks a shift in the Gulf. Rather than open vast new fields, producers are pouring money into old ones, hoping to squeeze more value from gas streams heavy with liquids. The firm has awarded contracts worth $5bn, the largest investment in its history, to expand and streamline processing across four core sites: Asab, Buhasa, Habshan and the Das Island liquefaction plant.\n\n\nThe plan is simple enough. By easing bottlenecks and refreshing ageing units, ADNOC Gas hopes to raise throughput and tap additional reservoirs. More sales gas, condensate and natural gas liquids would help meet growing domestic needs while boosting exports. The company cites the programme as central to its aim of lifting earnings by more than 40% between 2023 and 2029.\n\n\nPhase one work has gone to familiar names. Wood has secured a multibillion dollar package at Habshan. Petrofac will handle upgrades on Das Island, while Kent will work at Asab and Buhasa. The engineering, procurement and construction management model is meant to keep cost and schedule in check while allowing the facilities to keep running, a delicate task in brownfield projects.\n\n\nAnalysts see the move as part of a wider regional surge in spending. Middle Eastern producers may invest about $130bn in oil and gas supply in 2025, roughly 15% of the global total. Saudi Arabia still dominates upstream budgets, yet the UAE is gaining ground as it seeks greater gas self sufficiency, more liquids for export and extra feedstock for petrochemicals.\n\n\nExport projects add to the picture. Oman has begun building Marsa LNG at Suhar, a small but solar powered liquefaction plant aimed at marine fuel. Qatar continues to expand LNG capacity and shipping to keep its central role in global gas trade. Together with ADNOC Gas’s scheme, these efforts show how Gulf states are using liquids rich gas to adjust to shifting demand.\n\n\nFor the UAE, the near term prize is steadier supply at home as industry and power use grow. Upgrading existing assets allows the company to add volumes without waiting for fresh field developments. Other phases at Habshan and Ruwais are planned, pointing to years of work ahead.\n\n\nRisks remain. Contractors are stretched, costs are rising and brownfield work is tricky. Softer global gas prices have also reminded exporters of the need for cheap, flexible supply. Even so, ADNOC Gas’s timing suggests that Gulf producers remain committed to long term gas strategies, betting that efficiency gains in old plants will matter as much as new finds.\n', 'A record ADNOC Gas program signals a regional pivot toward upgrading fields to meet rising gas demand', 0, '2025-12-17 14:43:26', '2025-12-17 14:43:26', 1, 'http://localhost:8000/uploads/a6a1bfaa-ff07-4dd5-b4ee-9798353e3dfa.jpg', NULL, NULL),
(26, 'How AI Is Powering a New Middle East Energy Push', 'how-ai-is-powering-a-new-middle-east-energy-push', 'A fresh surge of digital ambition is sweeping through the Middle East energy sector as operators lean into artificial intelligence and data driven platforms. Wood’s Middle East Digital and AI Hub sits at the center of this shift, pulling together advisers, data specialists and tech partners to tackle everything from asset health to low carbon planning.\n\n\nThe momentum was on display at this year’s ADIPEC conference in Abu Dhabi. Wood showcased how AI, digital twins and predictive tools can shrink emissions, support rising data centre demand and sharpen operations across the value chain. Executives argued that pairing cloud analytics with field experience helps cut downtime, extend equipment life and tighten safety across upstream and midstream sites.\n\n\nThe regional timing is strategic. Gulf states are pushing to boost domestic gas supply and advance more complex developments. Wood’s team is rolling out advanced asset management, AI driven maintenance and digital twins, supported by tools such as its maintAI platform. The company points to projects that avoided major capital spending on production facilities and trimmed offshore trips by using integrated digital twins, a result that is strengthening the case for faster adoption.\n\n\nLocal giants are moving in lockstep. ADNOC has built ENERGYai with AIQ, Microsoft and G42 by training large language models and task specific agents on decades of operational data. After its debut at ADIPEC in 2024, a three year contract signed in 2025 will bring ENERGYai into ADNOC’s upstream operations to speed decisions, raise efficiency and cut emissions. It marks one of the region’s clearest signals that AI is shifting from pilot projects to everyday use.\n\n\nThis push fits into a broader race to build AI strength across the Gulf. The UAE and Saudi Arabia now rank among the global leaders for AI talent and are backing major data centre and infrastructure investments. That growing ecosystem is giving energy firms access to local skills and processing power for subsurface modelling, production tuning and emissions control.\n\n\nThe shift is not without hurdles. Legacy systems can resist integration, and cybersecurity concerns are rising as operational data enters cloud and hybrid environments. Regulators are urging innovation while calling for strong governance and clear accountability for AI driven decisions.\n\n\nEven so, the trajectory is unmistakable. With Wood expanding digital support and ADNOC scaling its AI platform, the region is beginning to turn long standing digital plans into real operational change. For Gulf producers, AI is quickly moving from a helpful add on to a core element of how projects are planned and run.\n', 'Wood and ADNOC expand digital platforms as regional operators shift from pilots to full deployment', 0, '2025-12-17 14:44:04', '2025-12-17 14:44:04', 1, 'http://localhost:8000/uploads/87aa35be-4b33-489d-94fe-964674b4820a.jpg', NULL, NULL),
(27, 'Saudi Shale Leap Redraws Gulf Energy Ambitions', 'saudi-shale-leap-redraws-gulf-energy-ambitions', 'Saudi Arabia has begun production at the Jafurah shale gas field, opening a new phase in its effort to expand domestic gas supply and reduce long-term reliance on oil. Early output of about 450mn cubic feet a day and a planned investment of roughly $100bn place the project among the most significant unconventional developments outside the US.\n\n\nThe field’s estimated reserves have been revised over time, rising from about 200tn cubic feet to recent figures near 229tn. Officials say this underlines Jafurah’s role in meeting industrial demand and supporting economic diversification.\n\n\nFinancing momentum has been reinforced by an $11bn midstream agreement with a group led by Global Infrastructure Partners, part of BlackRock. The consortium will take a 49 per cent stake in key processing assets under a long-term lease, while Saudi authorities retain operational control. Analysts view the arrangement as evidence of steady global interest in energy projects tied to wider Gulf restructuring plans.\n\n\nRegional strategists argue that Jafurah forms part of a broader shift toward unconventional resources across the Middle East. Shale development, still limited in the region, is seen as a way to reduce crude use in power generation, create space for new industries and build optionality for future gas exports.\n\n\nTechnical hurdles remain, including the demands of operating in geological settings that have seen little commercial shale activity. But advisers say investor sentiment has held up as initial production confirms the field’s potential scale.\n\n\nOfficials expect progress at Jafurah to encourage similar ventures in neighbouring states, potentially altering regional gas flows and supporting industrial growth linked to more reliable domestic supply.\n\n\nAs output expands toward longer-term targets, the project is set to influence how Gulf producers position themselves in global gas markets and how they balance investment between conventional and unconventional sources.\n', 'Riyadh expands Jafurah output as investors back unconventional gas', 0, '2025-12-17 14:44:41', '2025-12-17 14:44:41', 1, 'http://localhost:8000/uploads/c30e9098-441e-430a-976b-150db24eea9c.jpg', NULL, NULL),
(28, 'Oman Bets on an AI Twin to Boost Its Oil Fields', 'oman-bets-on-an-ai-twin-to-boost-its-oil-fields', 'Oman has become an unexpected proving ground for the next wave of digital thinking in Middle East energy. Petroleum Development Oman has struck a strategic deal with Kongsberg Digital to deploy an AI powered digital twin across its fields and processing hubs. The move marks a shift from small pilot projects to full scale systems that influence daily operations and long term plans.\n\n\nPDO will use Kongsberg’s industrial software as the backbone for a virtual replica of its subsurface, wells and surface facilities. The platform blends real time operational data with enterprise information and physics based models. Engineers can test scenarios in minutes, spot bottlenecks faster and decide which interventions deliver the greatest impact.\n\n\nFor a company responsible for much of the country’s oil and gas output, the portfolio implications are large. Digital models help planners weigh the value of infill wells, recompletions and plant debottlenecking. They also clarify how shifts in drilling schedules or maintenance cycles ripple through recovery, emissions and cost profiles over the life of a field. Executives see the project as central to sustaining a competitive cost base while extending the performance of aging assets.\n\n\nThe partnership arrives as regional producers push advanced analytics further into day to day work. Kongsberg already partners with several Middle Eastern operators, but the Oman rollout is one of its most comprehensive deployments. The plan is to introduce twins across PDO sites on a common platform so insights from one asset can be quickly reused on others. Even a single percentage point gain in uptime or recovery can translate into major value in this market.\n\n\nSafety and emissions goals sit at the core of the effort. With a live view of equipment condition, operating limits and energy use, the system aims to support predictive maintenance and reduce unplanned outages. It can also flag flaring risks, inefficient modes and spots where power demand can be trimmed. For a producer that pitches stability and lower costs to investors, improved reliability paired with lower emissions intensity is a strong signal.\n\n\nOther national oil companies are tracking the results. Saudi Arabia, the United Arab Emirates and Qatar are rolling out digital programs of their own, but Oman’s enterprise wide approach offers a rare example of software woven directly into everyday field management.\n\n\nFor now, PDO’s project shows how quickly digital ideas are turning into operational tools. By pairing long lived assets with flexible AI, Oman is betting that smarter data use can uncover reserves, stretch field life and keep margins healthy in a tougher global market.\n', 'PDO and Kongsberg launch an AI driven digital twin to sharpen output, safety and costs across Omani assets', 0, '2025-12-17 14:45:27', '2025-12-17 14:45:27', 1, 'http://localhost:8000/uploads/8065c7a4-45e7-47a5-a1da-1e4de95bc0fd.jpg', NULL, NULL),
(29, 'A High-Voltage Union: Willdan Joins Forces With APG', 'a-high-voltage-union-willdan-joins-forces-with-apg', 'Willdan has agreed to acquire Alternative Power Generation for up to $43.5mn, in a move aimed at strengthening its position in the fast-growing market for advanced electrical systems and resilient grid infrastructure.\n\nThe deal, announced in March, comes as pressure on the US power network increases due to the expansion of electric vehicles, rapid data-centre construction and ageing transmission assets. Utilities and local authorities have been seeking contractors able to deliver full-service solutions from design to installation.\n\n“This acquisition strengthens our ability to deliver comprehensive energy solutions from design to construction,” said Mike Bieber, Willdan’s chief executive. “It accelerates our mission to help communities and businesses modernize and secure their energy infrastructure.”\n\nAPG builds microgrids, high-speed EV charging networks and backup power systems for technology campuses and industrial clients. Its operations focus on translating complex power requirements into on-site infrastructure able to operate during grid outages or periods of high demand.\n\nThe acquisition allows Willdan to pair APG’s hands-on electrical capabilities with its national engineering business. The group expects that broader coverage will help it compete for a larger share of public and private projects linked to grid reliability and distributed energy.\n\nFederal and state programmes have released significant funding for clean-energy and grid-upgrade work in recent years. Much of this support favours companies that can manage project development, planning and construction under a single contract.\nAnalysts view the transaction as part of a wider shift in which mid-sized engineering and services groups have taken on roles once held by large utilities. The sector has become more fragmented as project needs have grown more technical and timelines have shortened, especially in EV charging and backup power for data-centre operators.\n\nWilldan will now focus on integrating APG’s teams and systems. Aligning engineering processes and project delivery methods is expected to be a key task as the company competes for large contracts with tighter completion schedules.\n\nDemand for resilient local grids, campus-level power systems and fast EV charging continues to rise. With APG’s addition, Willdan is positioning itself to capture growth in these areas, though the pace of project awards and the broader funding environment will shape how quickly the combined business expands.\n', 'Willdan acquires APG for up to $43.5M, boosting its ability to deliver EV charging, microgrids, and resilient energy solutions', 1, '2025-12-17 14:53:14', '2025-12-17 14:53:14', 2, 'http://localhost:8000/uploads/ec5f6987-55bc-49cd-931d-2f8d6258f035.png', NULL, NULL),
(30, 'Schneider Bets Big on a Unified Future for US Power', 'schneider-bets-big-on-a-unified-future-for-us-power', 'American utilities are racing to keep pace with rising demand, aging hardware, and a fast spread of renewable power. Schneider Electric believes it has an answer with the One Digital Grid Platform, a unified tool built to simplify a system that often feels like a tangle of mismatched parts.\n\n\nThe platform pulls outage management, grid control, and coordination of rooftop solar and other distributed resources into a single cloud interface. Instead of juggling isolated systems, operators can track conditions across the network in real time and act before small issues turn costly.\n\n\nEarly pilots suggest the approach works. Utilities using the system report outages dropping by as much as 40%, a figure that hints at both steadier service and lower operating expenses. One executive involved in testing said the shift felt less like an upgrade and more like a reset. The move away from siloed tools brought faster planning, sharper forecasts, and quicker field response.\n\n\nThe platform’s flexibility is part of the appeal. Utilities can roll it out in stages, shaping modernization plans around budgets and regulatory demands. That matters in an industry pulled between the push for cleaner energy and the pressure to keep prices grounded.\n\n\nTransitioning from legacy systems will not be simple. Many utilities still rely on software built for an earlier era. Yet the momentum behind digital consolidation is building. By merging critical functions with predictive intelligence, Schneider aims to set a new standard for modern grid operations.\n\n\nAs the nation leans harder on electricity for homes, vehicles, and industry, the need for tools that trim complexity and deliver clear results grows more urgent. If the early numbers hold, the One Digital Grid Platform could become a central piece of the next generation of American power management.\n', 'Schneider’s One Digital Grid Platform unifies control and cuts outages by up to 40% across US utilities', 0, '2025-12-17 14:53:56', '2025-12-17 14:53:56', 2, 'http://localhost:8000/uploads/aa272271-2d2e-4e62-afa4-876c9cb94b04.png', NULL, NULL),
(31, 'Power From the Porch: How Homes Are Reinventing the Grid', 'power-from-the-porch-how-homes-are-reinventing-the-grid', 'Sunrun and Pacific Gas and Electric are launching a residential virtual power plant in California that will use home batteries to support the state’s electricity system during periods of high demand.\n\n\nAbout 600 households will send stored solar power from their rooftops to the grid this summer. Participants are expected to receive up to 150 dollars for supplying energy during peak hours, according to the companies. The programme aims to ease strain on the network without building additional large-scale infrastructure.\n\n\nThe project reflects a broader shift in the utility model. Electricity in the United States has traditionally moved in one direction, from central stations to consumers. Virtual power plants, or VPPs, combine the output of many small systems such as residential batteries and dispatch it when needed, creating a more flexible supply resource.\n\n\n“Virtual power plants are rewriting the rules of the energy game,” said one senior analyst, noting that the model offers “agility and localized control that traditional systems cannot match.”\n\n\nThe system relies on software from Tesla and Lunar Energy that manages when batteries charge and discharge. These tools respond automatically to grid signals, helping stabilise supply while reducing operating costs for utilities.\n\n\nFor power companies, such initiatives shift their role from energy producers to coordinators of distributed resources. For households, the arrangements can lower energy bills and give consumers more direct involvement in local power management.\n\n\nPolicy support has helped advance the model. Federal incentives for clean energy and rising interest in home solar and storage have encouraged utilities to test small-scale aggregation schemes in several states.\n\n\nHowever, regulators and companies continue to examine issues around data handling, technical standards and access for lower income households. These factors are seen as important for broader adoption.\n\n\nThe California programme adds to a growing number of pilots across the country as electricity demand rises and extreme weather events place pressure on grids. If the approach proves cost effective, utilities are expected to expand residential participation further over the next decade.\n', 'Sunrun and PG&E link household batteries to the grid as utilities test new ways to manage peak demand', 0, '2025-12-17 14:54:37', '2025-12-17 14:54:37', 2, 'http://localhost:8000/uploads/4e67c0ba-00a4-423d-ba5b-1ec0e605efe8.png', NULL, NULL),
(32, 'G&W–Safegrid Team Up to Outrun the Next Outage', 'g-w-safegrid-team-up-to-outrun-the-next-outage', 'G&W Electric is placing a bet on Finnish startup Safegrid, hoping sharper data and smarter tools can help U.S. utilities stay ahead of trouble on an increasingly stressed power grid.\n\n\nThe investment, announced in April, blends G&W’s century of utility hardware experience with Safegrid’s real time monitoring platform. The goal is simple: give grid operators a clearer look at small issues before they flare into outages.\n\n\nSafegrid’s wireless sensors clamp onto existing equipment with little fuss. Once in place, they track conditions across distribution lines and send alerts when they spot early signs of faults. The readings flow into cloud dashboards that highlight patterns and point operators toward likely problem spots.\n\n\nA G&W spokesperson said the partnership will help utilities modernize without halting their daily work. That fits with G&W’s broader push to weave digital intelligence into a sector that has long relied on rugged hardware more than software.\n\n\nThe effort comes at a tense moment for grid managers. Aging equipment, rising demand, and climate driven extremes are straining networks built for steadier times. At the same time, utilities are adding more renewable power, which requires faster decisions and tighter visibility. Analysts say predictive tools could trim response times and, in some cases, limit downtime by offering earlier warnings. This is the only instance in which a percentage would normally appear.\n\n\nFor Safegrid, teaming with G&W opens a path into the U.S. market with the backing of a well known industry supplier. For G&W, it offers a way to add value without asking customers to rebuild systems from the ground up.\n\n\nInstead of sweeping overhauls, the two companies are betting on targeted enhancements. Smarter sensors, clearer data, and quicker interpretation could help utilities strengthen reliability from within.\n\n\nTheir collaboration underscores a shift in the power sector. Legacy expertise is meeting emerging technology, and the mix is starting to produce tools that feel both practical and timely.\n', 'A new G&W–Safegrid partnership brings AI grid tech to U.S. utilities, reshaping outage prevention and accelerating smart grid adoption', 0, '2025-12-17 14:55:13', '2025-12-17 14:55:13', 2, 'http://localhost:8000/uploads/0a6fcaed-883e-409e-bff9-ef86ff9c2f89.png', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `post_categories`
--

CREATE TABLE `post_categories` (
  `post_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `post_categories`
--

INSERT INTO `post_categories` (`post_id`, `category_id`) VALUES
(19, 5),
(20, 6),
(21, 7),
(28, 7),
(30, 7),
(22, 8),
(24, 8),
(29, 8),
(32, 8),
(23, 9),
(25, 10),
(31, 10),
(26, 11),
(27, 12);

-- --------------------------------------------------------

--
-- Table structure for table `post_tags`
--

CREATE TABLE `post_tags` (
  `post_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `slug` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `hashed_password` varchar(255) DEFAULT NULL,
  `role` enum('admin','author','user','read','reader') DEFAULT 'user',
  `created_at` datetime DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `avatar_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `hashed_password`, `role`, `created_at`, `is_verified`, `is_active`, `avatar_url`) VALUES
(1, 'admin@blog.com', 'admin', '$2b$12$Wjxt3ssU5WElUZoH6KGjwOyIbsa1DQzy6Ng.bDVf0hJh2FxgpVTMO', 'admin', '2025-12-01 12:01:23', 1, 1, 'http://localhost:8000/uploads/97007c83-45be-4715-98a0-1b90df4781c1.png'),
(2, 'author@blog.com', 'john_doe', '$2b$12$2ZtMz9LFjjRQYW/IaCDa1.9J9PLBc0FARmkA.AJvsyJ.htIDALzUu', 'author', '2025-12-01 12:01:23', 1, 1, 'http://localhost:8000/uploads/d45f9705-30fe-4149-b821-ead08c79dd77.png'),
(3, 'reader@blog.com', 'jane_reader', '$2b$12$2B4PerP2f5Yo5EMNd3KPt.m4I6xXszmE2EEWem3b78GH3./LbKcsS', 'user', '2025-12-01 12:01:23', 0, 1, 'http://localhost:8000/uploads/8911f393-2bd0-4e7f-ba20-175eb3a029a0.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_categories_name` (`name`),
  ADD UNIQUE KEY `ix_categories_slug` (`slug`),
  ADD KEY `ix_categories_id` (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_contacts_id` (`id`);

--
-- Indexes for table `email_verification_tokens`
--
ALTER TABLE `email_verification_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_email_verification_tokens_token` (`token`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `ix_email_verification_tokens_id` (`id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `ix_likes_id` (`id`),
  ADD KEY `fk_likes_comment` (`comment_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_posts_slug` (`slug`),
  ADD KEY `author_id` (`author_id`),
  ADD KEY `ix_posts_id` (`id`),
  ADD KEY `ix_posts_title` (`title`);

--
-- Indexes for table `post_categories`
--
ALTER TABLE `post_categories`
  ADD PRIMARY KEY (`post_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `post_tags`
--
ALTER TABLE `post_tags`
  ADD PRIMARY KEY (`post_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_tags_slug` (`slug`),
  ADD UNIQUE KEY `ix_tags_name` (`name`),
  ADD KEY `ix_tags_id` (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_users_email` (`email`),
  ADD UNIQUE KEY `ix_users_username` (`username`),
  ADD KEY `ix_users_id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `email_verification_tokens`
--
ALTER TABLE `email_verification_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `email_verification_tokens`
--
ALTER TABLE `email_verification_tokens`
  ADD CONSTRAINT `email_verification_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `fk_likes_comment` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `post_categories`
--
ALTER TABLE `post_categories`
  ADD CONSTRAINT `post_categories_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
  ADD CONSTRAINT `post_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `post_tags`
--
ALTER TABLE `post_tags`
  ADD CONSTRAINT `post_tags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
  ADD CONSTRAINT `post_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
