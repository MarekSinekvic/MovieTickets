<?php

namespace App\DataFixtures;

use App\Entity\Show;
use App\Repository\MovieRepository;
use App\Repository\TheaterRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ShowFixture extends Fixture implements DependentFixtureInterface
{
    public function __construct(
        private TheaterRepository $theaterRepository,
        private MovieRepository $movieRepository
    )
    {
    }
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        $movies = $this->movieRepository->findAll();
        shuffle($movies);
        for ($i = 0; $i < 30; $i++) {
            $show = new Show();
            $begin = $faker->dateTime(); $end = $faker->dateTime();
            if ($begin > $end) {
                $temp = $end;
                $end = $begin;
                $begin = $temp;
            }
            $show->setBeginDate($begin);
            $show->setEndDate($end);
            $show->setViews(random_int(0,100000));
            $show->setTheater($this->theaterRepository->find(1));
            $show->setMovie($movies[$i]);
            $manager->persist($show);
        }

        $manager->flush();
    }
    public function getDependencies(): array
    {
        return [
            MovieFixture::class
        ];
    }
}
