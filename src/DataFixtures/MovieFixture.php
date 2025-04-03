<?php

namespace App\DataFixtures;

use App\Entity\Media;
use App\Entity\Movie;
use App\Entity\Tag;
use App\Repository\TagRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\ORM\EntityManager;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use FileProcessor;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\File\File;

class MovieFixture extends Fixture implements DependentFixtureInterface
{
    public function __construct(
        private TagRepository $tagRepository
    )
    {
    }
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();
        $files = new Filesystem();

        $tags = $this->tagRepository->findAll();
        for ($i = 0; $i < 100; $i++) {
            $movie = new Movie();
            $movie->setName(join(' ',$faker->words(2)));
            $movie->setDescription($faker->text());
            for ($j = 0; $j < random_int(5,10); $j++) {
                $movie->addTag($tags[random_int(0,count($tags)-1)]);
            }
            for ($j = 0; $j < random_int(2,4); $j++) {

                $media = new Media();
                $files = array_keys(iterator_to_array((new Finder())->files()->in(__DIR__."/../../var/FakerMedia/")));
                $media->uploadFile(new File($files[random_int(0,count($files)-1)]),true); 
                if ($j == 0) $movie->setPreview($media);
                
                $manager->persist($media);
                $movie->addMedia($media);
            }
            $manager->persist($movie);
        }

        $manager->flush();
    }
    public function getDependencies(): array
    {
        return [
            TagFixture::class
        ];
    }
}
