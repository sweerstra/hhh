<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

function isFresh($title, $re)
{
    preg_match_all($re, strtolower($title), $matches, PREG_SET_ORDER, 0);

    return count($matches) !== 0;
}

function contains($title, $keyword)
{
    return strpos($title, $keyword) !== false;
}

function containsKeyword($title, $keywords)
{
    foreach ($keywords as $keyword) {
        if (contains($title, $keyword)) {
            return true;
        }
    }

    return false;
}

function getMatches($data, $keywords, $re)
{
    $matches = array();

    foreach ($data as $item) {
        $data = $item['data'];
        $title = $data['title'];
        $reddit = 'https://www.reddit.com';

        if (isFresh($title, $re) && containsKeyword(strtolower($title), $keywords)) {
            $matches[] = array(
                'id' => $data['name'],
                'title' => $title,
                'link' => $reddit . $data['permalink']
            );
        }
    }

    return $matches;
}

$url = 'https://www.reddit.com/r/hiphopheads.json?limit=100&before=' . $_GET['id'];
$json = json_decode(file_get_contents($url), true);

$data = $json['data']['children'];
$keywords = explode(':', $_GET['keywords']);
$re = '/\[(.*fresh.*?)\]/i';

$matches = getMatches($data, $keywords, $re);
$latest = count($matches) > 0 ? $matches[0] : null;

echo json_encode(
    array('latest' => $latest, 'data' => $matches)
);
