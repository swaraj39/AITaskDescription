package com.example.demo.Aspects;


import com.example.demo.Annotations.LogTime;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspects {

    // this is the action and the pointcut
//    @Before("execution(* com.example.demo.Conrollers.FrontController.*(..))")
//    public void logBeforeExecution(JoinPoint joinPoint) throws Throwable {
//        log.info("Before FrontController method called named :" +  joinPoint.getSignature().getName());
//    }

//    @After("execution(* com.example.demo.Conrollers.FrontController.*(..))")
//    public void logAfterExecution(JoinPoint joinPoint) throws Throwable {
//        log.info("After FrontController method called named :" +  joinPoint.getSignature().getName());
//    }

    @AfterReturning("execution(* com.example.demo.Conrollers.FrontController.*(..))")
    public void logAfterReturningExecution(JoinPoint joinPoint) throws Throwable {
        log.info("After Returning FrontController method called named :" +  joinPoint.getSignature().getName());
    }

//    @AfterThrowing("execution(* com.example.demo.Conrollers.FrontController.*(..))")
//    public void logAfterThrowingExecution(JoinPoint joinPoint) throws Throwable {
//        log.info("AfterThrowing FrontController method called named :" +  joinPoint.getSignature().getName());
//    }

    //Around same method to exceute after and before
    @Around("execution(* com.example.demo.Conrollers.FrontController.getAllTask(..))")
    public Object logAroundExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        log.info("Before FrontController method called named :" +  joinPoint.getSignature().getName());
        Object proceed = joinPoint.proceed();
        long end = System.currentTimeMillis();
        log.info("Time taken {} ms",end-start);
        log.info("After FrontController method called named :" +  joinPoint.getSignature().getName());
        return  proceed;
    }

    @Around("@annotation(logTime)")
    public Object getLogTime(ProceedingJoinPoint joinPoint, LogTime logTime) throws Throwable {
        long start = System.currentTimeMillis();

        Object result = joinPoint.proceed();

        long executionTime = System.currentTimeMillis() - start;

        System.out.println(joinPoint.getSignature()
                + " executed in " + executionTime + "ms"
                + " With priority " + logTime.value());

        return result;
    }
}
