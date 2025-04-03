<?php

namespace App\DataFixtures;

use App\Entity\Tag;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class TagFixture extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();
        
        for ($i = 0; $i < 50; $i++) {
            $tag = new Tag();
            $tag->setName($faker->word());
            $manager->persist($tag);
        }

        $manager->flush();
    }
}
