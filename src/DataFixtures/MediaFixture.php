<?php

namespace App\DataFixtures;

use App\Entity\Media;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use FileProcessor;
use Symfony\Component\Finder\Finder;

class MediaFixture extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // $media = new Media();
        // $files = iterator_to_array(new Finder()->in(FileProcessor::FOLDER_PATH)->files());
        // $media->uploadFile($files[random_int(0,count($files)-1)]);
        // $manager->persist($media);

        $manager->flush();
    }
}
