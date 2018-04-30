-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 30, 2018 at 04:21 PM
-- Server version: 5.7.22-0ubuntu0.16.04.1
-- PHP Version: 7.0.29-1+ubuntu16.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `p2p_game`
--

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `id` int(11) NOT NULL,
  `user_token` varchar(64) NOT NULL,
  `name` varchar(20) NOT NULL,
  `game_data` text NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `players`
--

INSERT INTO `players` (`id`, `user_token`, `name`, `game_data`, `date_time`) VALUES
(394, '8BxB2ur1ZS0N2Yr7AAAD', 'gozilla', '{"left":372,"top":104}', '2018-04-30 10:28:28'),
(395, 'W68FIS7S2m-eA_ncAAAE', 'Player#12', '{"left":372,"top":104}', '2018-04-30 10:37:10'),
(396, 'S6s3M--0eCXJYp3jAAAF', 'Player#12', '{"left":372,"top":104}', '2018-04-30 10:37:18'),
(400, 'jc1Nd-3yLc9zdFPQAAAF', 'Player#12', '{"left":372,"top":104}', '2018-04-30 10:47:09'),
(401, 'e-2f8l0IKPjKJ3nJAAAG', 'Player#12', '{"left":372,"top":104}', '2018-04-30 10:47:23'),
(402, 'e-2f8l0IKPjKJ3nJAAAG', 'Player#12', '{"left":372,"top":104}', '2018-04-30 10:47:24'),
(403, 'jc1Nd-3yLc9zdFPQAAAF', 'Player#12', '{"left":372,"top":104}', '2018-04-30 10:47:27'),
(412, 'Qa3B-ai5P_wZwnYEAAAL', 'Player#12', '{"left":372,"top":104}', '2018-04-30 11:06:29'),
(414, 'yBP1uQiTYcDYouorAAAB', 'Player#12', '{"left":372,"top":104}', '2018-04-30 11:08:20'),
(422, 'Ehx8nDZiSNeqdCdSAAAE', 'Player#12', '{"left":372,"top":104}', '2018-04-30 11:15:58'),
(430, '2IFRgMoCtR9X0NxuAAAI', 'Player#12', '{"left":372,"top":104}', '2018-04-30 11:56:24'),
(445, 'DYklfrNWQ7IAF_yZAAAN', 'Player#12', '{"left":372,"top":104}', '2018-04-30 12:14:08'),
(447, 'vPfIXWwkSO1ysQl4AAAB', 'Player#12', '{"left":372,"top":104}', '2018-04-30 12:25:40'),
(449, 'Gnckk0puteWGaXUEAAAB', 'Player#12', '{"left":372,"top":104}', '2018-04-30 12:26:42'),
(451, 'AH6hiLAnGI2v0x_oAAAB', 'Player#12', '{"left":372,"top":104}', '2018-04-30 12:27:56'),
(454, 'AG2CS84-9Sei0DCiAAAD', 'Player#12', '{"left":372,"top":104}', '2018-04-30 12:29:36'),
(456, 'BMlW3xSdk66DyTjNAAAB', 'Player#12', '{"left":372,"top":104}', '2018-04-30 12:35:36'),
(458, 'uEGXNjDAAjESBKT7AAAB', 'Player#12', '{"left":372,"top":104}', '2018-04-30 12:36:32');

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `id` int(11) NOT NULL,
  `admin_token` varchar(64) NOT NULL,
  `user_token` varchar(64) DEFAULT NULL,
  `date_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `game_data` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `players`
--
ALTER TABLE `players`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=468;
--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=216;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
