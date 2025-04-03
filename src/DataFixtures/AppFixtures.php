<?php

namespace App\DataFixtures;

use App\Entity\Theater;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $theater = new Theater();
        $theater->setName("test theater");
        $theater->setSeatsCount(100);
        $manager->persist($theater);

        $manager->flush();
    }
}
